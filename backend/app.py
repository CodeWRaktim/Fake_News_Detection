from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import joblib
import os
import sys
import logging
from datetime import timedelta, datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- LOGGING ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)

# Import your existing preprocess function
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from preprocess import clean_text
from lime.lime_text import LimeTextExplainer

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",                                                          # Local dev
    "https://fake-news-detection-mftjqz6d3-codewraktims-projects.vercel.app",        # Vercel deployment
    "https://*.vercel.app"                                                            # Any future Vercel preview URLs
])

# --- CONFIGURATION ---
# Look for a PostgreSQL URL in .env, otherwise use SQLite
database_url = os.getenv("DATABASE_URL")

if database_url:
    # IMPORTANT: SQLAlchemy requires 'postgresql://' instead of 'postgres://'
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # Fallback for local development
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DB_PATH = os.path.join(BASE_DIR, 'users.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Fetch the secret key from the .env file
app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY", "fallback-secret-for-dev")
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# --- INPUT LIMITS ---
MAX_TEXT_LENGTH = 10000  # Maximum characters allowed per request

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- RATE LIMITER ---
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

# --- USER MODEL ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    history = db.relationship('History', backref='user', lazy=True)

class History(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    snippet = db.Column(db.String(200), nullable=False)
    prediction = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create the database file
with app.app_context():
    db.create_all()

# --- LOAD ML MODELS ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/fake_news_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), '../models/tfidf_vectorizer.pkl')

# Hugging Face model repo (used when .pkl files are not found locally, e.g. on Render)
HF_REPO = "Raktim900/fake-news-detection-models"
HF_BASE_URL = f"https://huggingface.co/{HF_REPO}/resolve/main"

def download_model_if_missing(local_path, filename):
    """Download a model file from Hugging Face if it doesn't exist locally."""
    if not os.path.exists(local_path):
        import urllib.request
        url = f"{HF_BASE_URL}/{filename}"
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        logger.info(f"Model not found locally. Downloading '{filename}' from Hugging Face...")
        urllib.request.urlretrieve(url, local_path)
        logger.info(f"Downloaded '{filename}' successfully.")
    else:
        logger.info(f"Model found locally: '{filename}'")

try:
    download_model_if_missing(MODEL_PATH, "fake_news_model.pkl")
    download_model_if_missing(VECTORIZER_PATH, "tfidf_vectorizer.pkl")

    logger.info("Loading ML models...")
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    explainer = LimeTextExplainer(class_names=['Fake', 'Real'])
    logger.info("ML models loaded successfully.")
except Exception as e:
    logger.error(f"FATAL: Failed to load ML models: {e}")
    model = None

    explainer = LimeTextExplainer(class_names=['Fake', 'Real'])
    logger.info("ML models loaded successfully.")
except Exception as e:
    logger.error(f"FATAL: Failed to load ML models: {e}")
    model = None
    vectorizer = None
    explainer = None

def predict_pipeline(texts):
    vectors = vectorizer.transform(texts)
    return model.predict_proba(vectors)

# --- AUTH ROUTES ---

@app.route('/register', methods=['POST'])
@limiter.limit("5 per minute")  # Prevent registration spam
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "Username and password are required"}), 400
    
    username = data['username'].strip()
    password = data['password']

    if len(username) < 3 or len(username) > 30:
        return jsonify({"msg": "Username must be 3-30 characters"}), 400
    if len(password) < 4:
        return jsonify({"msg": "Password must be at least 4 characters"}), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    logger.info(f"New user registered: {username}")
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
@limiter.limit("10 per minute")  # Prevent brute-force attacks
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "Username and password are required"}), 400
        
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=data['username'])
        logger.info(f"User logged in: {data['username']}")
        return jsonify(access_token=access_token, username=data['username']), 200
    
    logger.warning(f"Failed login attempt for: {data.get('username', 'unknown')}")
    return jsonify({"msg": "Bad username or password"}), 401

# --- HISTORY ROUTE ---
@app.route('/history', methods=['GET'])
@jwt_required()
@limiter.limit("30 per minute")
def get_history():
    current_username = get_jwt_identity()
    user = User.query.filter_by(username=current_username).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    histories = History.query.filter_by(user_id=user.id).order_by(History.created_at.desc()).limit(20).all()
    
    results = []
    for h in histories:
        results.append({
            'id': h.id,
            'snippet': h.snippet,
            'prediction': h.prediction,
            'confidence': h.confidence,
            'created_at': h.created_at.strftime("%b %d, %Y %I:%M %p")
        })
        
    return jsonify(results), 200

# --- PREDICTION ROUTE (PROTECTED) ---

@app.route('/predict', methods=['POST'])
@jwt_required()
@limiter.limit("15 per minute")  # Prevent prediction spam
def predict():
    # Check if model is loaded
    if model is None or vectorizer is None:
        logger.error("Prediction attempted but ML models are not loaded.")
        return jsonify({'error': 'ML model is unavailable. Please contact admin.'}), 503

    try:
        data = request.get_json()
        if not data or not data.get('news'):
            return jsonify({'error': 'No news text provided.'}), 400

        raw_text = data['news']

        # Validate input length
        if not raw_text.strip():
            return jsonify({'error': 'News text cannot be empty.'}), 400
        if len(raw_text) > MAX_TEXT_LENGTH:
            return jsonify({'error': f'Text too long. Maximum {MAX_TEXT_LENGTH} characters allowed.'}), 400

        cleaned_text = clean_text(raw_text)
        
        if not cleaned_text.strip():
            return jsonify({'error': 'After cleaning, no valid text remains. Please provide a longer article.'}), 400

        vectorized_text = vectorizer.transform([cleaned_text])
        prediction_num = model.predict(vectorized_text)[0]
        prediction_label = "Real" if prediction_num == 1 else "Fake"
        
        probabilities = model.predict_proba(vectorized_text)[0]
        confidence = round(max(probabilities) * 100, 2)

        # Save history
        current_username = get_jwt_identity()
        user = User.query.filter_by(username=current_username).first()
        
        if user:
            snippet = raw_text[:100] + "..." if len(raw_text) > 100 else raw_text
            new_history = History(
                user_id=user.id,
                snippet=snippet,
                prediction=prediction_label,
                confidence=f"{confidence}%"
            )
            db.session.add(new_history)
            db.session.commit()

        logger.info(f"Prediction: {prediction_label} ({confidence}%) by user {current_username}")

        # NOTE: LIME explanation is NOT included here anymore for speed.
        # It is fetched on-demand via /explain route.
        return jsonify({
            'prediction': prediction_label,
            'confidence': f"{confidence}%",
            'user': current_username
        })

    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        return jsonify({'error': 'An internal error occurred during prediction.'}), 500


# --- LIME EXPLANATION ROUTE (ON-DEMAND) ---

@app.route('/explain', methods=['POST'])
@jwt_required()
@limiter.limit("10 per minute")  # LIME is expensive, limit aggressively
def explain():
    if explainer is None or model is None or vectorizer is None:
        return jsonify({'error': 'Explainer unavailable.'}), 503

    try:
        data = request.get_json()
        if not data or not data.get('news'):
            return jsonify({'error': 'No news text provided.'}), 400

        raw_text = data['news']
        if len(raw_text) > MAX_TEXT_LENGTH:
            return jsonify({'error': f'Text too long. Maximum {MAX_TEXT_LENGTH} characters.'}), 400

        cleaned_text = clean_text(raw_text)
        
        if not cleaned_text.strip():
            return jsonify({'error': 'No valid text after cleaning.'}), 400

        explanation = explainer.explain_instance(cleaned_text, predict_pipeline, num_features=6)
        important_words = [
            {'word': w, 'weight': round(wt, 4), 'impact': 'Real' if wt > 0 else 'Fake'} 
            for w, wt in explanation.as_list()
        ]

        logger.info(f"LIME explanation generated for user {get_jwt_identity()}")

        return jsonify({'explanation': important_words})

    except Exception as e:
        logger.error(f"Explanation error: {e}", exc_info=True)
        return jsonify({'error': 'Failed to generate explanation.'}), 500


# --- RATE LIMIT ERROR HANDLER ---
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Too many requests. Please slow down.", "retry_after": e.description}), 429


if __name__ == '__main__':
    app.run(debug=True, port=5000)
