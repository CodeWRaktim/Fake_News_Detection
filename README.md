# Fake News Detection System

## 📌 Project Overview
A complete end-to-end Machine Learning web application designed to detect fake news. Users can input a news article or headline, and the system uses NLP (TF-IDF) and a Logistic Regression model to predict if the news is REAL or FAKE, providing a confidence score and explainability highlights.

---

## 🚀 Step-by-Step Implementation Guide

### Step 1: Environment Setup
1. **Create the Project Directory**
   ```bash
   mkdir Fake-News-Detection
   cd Fake-News-Detection
   ```
2. **Create a Virtual Environment**
   ```bash
   python -m venv venv
   
   # Windows Activation
   venv\Scripts\activate
   
   # macOS/Linux Activation
   source venv/bin/activate
   ```
3. **Install Required Dependencies**
   Create a `requirements.txt` file with dependencies (e.g., `scikit-learn`, `pandas`, `nltk`, `flask`, `flask-cors`, `lime`, `joblib`) and install them:
   ```bash
   pip install -r requirements.txt
   ```

### Step 2: Project Structure Setup
Organize the project cleanly into the following structure:
```text
Fake-News-Detection/
│
├── backend/
│   └── app.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── models/
│   ├── fake_news_model.pkl    (generated later)
│   └── tfidf_vectorizer.pkl   (generated later)
│
├── data/                      (place dataset here)
│
├── preprocess.py
├── train_model.py
└── requirements.txt
```

### Step 3: Data Preprocessing (`preprocess.py`)
1. **Load Data**: Download a Fake/Real news dataset (e.g., from Kaggle) and place it in the `data/` folder.
2. **Clean Text**: Write functions to:
   - Convert text to lowercase.
   - Remove punctuation and special characters.
   - Remove stopwords (using `nltk`).
   - Tokenize the text.

### Step 4: Model Training (`train_model.py`)
1. **Load Data**: Import the preprocessed dataset.
2. **Vectorization**: Initialize and fit a `TfidfVectorizer` to convert the text into numerical feature vectors.
3. **Train Classifier**: Train a `LogisticRegression` model on the TF-IDF features.
4. **Evaluate**: Test the model's accuracy using a standard train-test split.
5. **Save Artifacts**: Export the trained model (`fake_news_model.pkl`) and the vectorizer (`tfidf_vectorizer.pkl`) to the `models/` directory using `joblib`.

### Step 5: Backend API Development (`backend/app.py`)
1. **Setup Flask**: Initialize a Flask application and enable CORS.
2. **Load Artifacts**: Load the `.pkl` model and vectorizer at startup.
3. **Explainable AI (XAI)**: Initialize a LIME (or SHAP) explainer to highlight important words.
4. **Create Endpoint**: Implement a `POST /predict` route that:
   - Accepts JSON input: `{"news": "..."}`
   - Preprocesses and vectorizes the incoming text.
   - Predicts whether the news is Fake or Real.
   - Calculates the confidence score.
   - Returns a JSON response:
     ```json
     {
       "prediction": "Fake",
       "confidence": "94%",
       "explanation": "..." 
     }
     ```

### Step 6: Web Frontend Development (`frontend/`)
1. **`index.html`**: Create a modern layout featuring a large textarea for input and a "Check News" button, along with an output display section.
2. **`style.css`**: Apply responsive, visually appealing styles.
3. **`script.js`**: 
   - Attach a click listener to the button.
   - Use the `fetch()` API to send the news text to `http://localhost:5000/predict`.
   - Update the UI dynamically with the prediction result, percentage, and explainability data.

### Step 7: Running and Testing Locally
1. **Run the Backend Model**:
   ```bash
   cd backend
   python app.py
   ```
   *(The server will typically start on `http://127.0.0.1:5000`)*
2. **Run the Frontend**:
   Simply double-click `frontend/index.html` to open it in your browser (or use VS Code Live Server).
3. **Test**: Paste an article into the text box and click the button to see the results.

### Step 8: Future Improvements
Consider leaving placeholders or comments for scaling the application:
- Implement deep learning approaches (LSTM, BERT).
- Build a Chrome Extension integration.
- Containerize the app with Docker and deploy to cloud providers (AWS/Render/Vercel).
