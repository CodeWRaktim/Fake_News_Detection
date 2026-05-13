import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.utils import shuffle
import os

# Import the functions we wrote in Step 3
from preprocess import clean_text

def load_all_data():
    """Load and combine all datasets into one DataFrame."""
    
    # --- Dataset 1: Original Fake.csv / True.csv ---
    fake_path = "data/Fake.csv"
    true_path = "data/True.csv"
    if not os.path.exists(fake_path) or not os.path.exists(true_path):
        print("Error: Fake.csv or True.csv not found in data/ folder.")
        return None

    fake_df = pd.read_csv(fake_path)
    true_df = pd.read_csv(true_path)
    fake_df['label'] = 0
    true_df['label'] = 1

    # Combine title + text for richer context
    fake_df['content'] = (fake_df.get('title', '').fillna('') + ' ' + fake_df.get('text', '').fillna('')).str.strip()
    true_df['content'] = (true_df.get('title', '').fillna('') + ' ' + true_df.get('text', '').fillna('')).str.strip()

    original_df = pd.concat([
        fake_df[['content', 'label']],
        true_df[['content', 'label']]
    ], ignore_index=True)
    print(f"  Original dataset: {len(original_df)} articles")

    # --- Dataset 2: WELFake Dataset ---
    welfake_path = "data/WELFake_Dataset.csv"
    if os.path.exists(welfake_path):
        welfake_df = pd.read_csv(welfake_path)
        welfake_df['content'] = (welfake_df.get('title', '').fillna('') + ' ' + welfake_df.get('text', '').fillna('')).str.strip()
        welfake_df = welfake_df[['content', 'label']].dropna()
        # WELFake uses INVERTED labels: 1=Fake, 0=Real — flip to match our convention (0=Fake, 1=Real)
        welfake_df['label'] = 1 - welfake_df['label'].astype(int)
        print(f"  WELFake dataset:  {len(welfake_df)} articles")
    else:
        welfake_df = pd.DataFrame(columns=['content', 'label'])
        print("  WELFake dataset not found — skipping.")

    # --- Dataset 3: LIAR Dataset (fake copy.csv) ---
    liar_path = "data/fake copy.csv"
    if os.path.exists(liar_path):
        liar_df = pd.read_csv(liar_path)
        # Map multi-class 'type' to binary: fake types = 0, exclude borderline (satire/state)
        fake_types = ['bs', 'bias', 'conspiracy', 'hate', 'junksci', 'fake']
        liar_df = liar_df[liar_df['type'].isin(fake_types)].copy()
        liar_df['label'] = 0
        liar_df['content'] = (liar_df.get('title', '').fillna('') + ' ' + liar_df.get('text', '').fillna('')).str.strip()
        liar_df = liar_df[['content', 'label']].dropna()
        print(f"  LIAR dataset:     {len(liar_df)} articles")
    else:
        liar_df = pd.DataFrame(columns=['content', 'label'])
        print("  LIAR dataset not found — skipping.")

    # --- Merge all datasets ---
    combined_df = pd.concat([original_df, welfake_df, liar_df], ignore_index=True)
    combined_df = combined_df.dropna(subset=['content', 'label'])
    combined_df = shuffle(combined_df, random_state=42).reset_index(drop=True)

    print(f"\n  Total combined: {len(combined_df)} articles")
    print(f"  Real: {(combined_df['label'] == 1).sum()} | Fake: {(combined_df['label'] == 0).sum()}")
    return combined_df


def train_and_save_model():
    print("=" * 50)
    print("  FAKE NEWS DETECTOR — TRAINING PIPELINE")
    print("=" * 50)

    print("\n[1/7] Loading and combining all datasets...")
    df = load_all_data()
    if df is None:
        return

    print("\n[2/7] Cleaning text data (this may take a few minutes)...")
    df['clean_content'] = df['content'].apply(clean_text)

    # Define inputs (X) and labels (y)
    X = df['clean_content']
    y = df['label']

    print("\n[3/7] Splitting into train/test sets (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"  Train: {len(X_train)} | Test: {len(X_test)}")

    print("\n[4/7] Vectorizing text with TF-IDF...")
    # Increased max_features to 10000 for the larger, diverse dataset
    vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
    X_train_tfidf = vectorizer.fit_transform(X_train)
    X_test_tfidf = vectorizer.transform(X_test)

    print("\n[5/7] Training Logistic Regression model...")
    model = LogisticRegression(max_iter=1000, C=1.0)
    model.fit(X_train_tfidf, y_train)

    print("\n[6/7] Evaluating the model...")
    y_pred = model.predict(X_test_tfidf)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\n  ✅ Model Accuracy: {accuracy * 100:.2f}%")
    print("\n  Classification Report:")
    print(classification_report(y_test, y_pred, target_names=['Fake', 'Real']))

    print("\n[7/7] Saving model artifacts...")
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/fake_news_model.pkl")
    joblib.dump(vectorizer, "models/tfidf_vectorizer.pkl")
    print("  ✅ Saved: models/fake_news_model.pkl")
    print("  ✅ Saved: models/tfidf_vectorizer.pkl")
    print("\n" + "=" * 50)
    print("  TRAINING COMPLETE!")
    print("=" * 50)

if __name__ == "__main__":
    train_and_save_model()
