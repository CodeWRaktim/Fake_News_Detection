import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download necessary NLTK data (runs only the first time)
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')

def clean_text(text):
    """
    Function to clean and preprocess news text.
    """
    # 1. Convert text to lowercase
    text = text.lower()
    
    # 2. Remove punctuation, URLs, and special characters using regex
    text = re.sub(r'https?://\S+|www\.\S+', '', text) # Remove URLs
    text = re.sub(r'\[.*?\]', '', text)               # Remove text in brackets
    text = re.sub(r'[^a-zA-Z\s]', '', text)           # Remove non-alphabetic characters
    
    # 3. Tokenize the text (split into words)
    words = word_tokenize(text)
    
    # 4. Remove stopwords (common words like 'the', 'is', 'in' that don't add meaning)
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in words if word not in stop_words]
    
    # 5. Join the words back into a single string
    cleaned_text = " ".join(filtered_words)
    
    return cleaned_text

def load_and_merge_data(fake_path, true_path):
    """
    Helper function to load the datasets, label them, and merge them.
    Fake news = 0, Real news = 1
    """
    print("Loading datasets...")
    fake_df = pd.read_csv(fake_path)
    true_df = pd.read_csv(true_path)
    
    # Add labels
    fake_df['label'] = 0
    true_df['label'] = 1
    
    # Combine titles and text (optional, but often improves accuracy)
    fake_df['content'] = fake_df['title'] + " " + fake_df['text']
    true_df['content'] = true_df['title'] + " " + true_df['text']
    
    # Merge datasets
    df = pd.concat([fake_df, true_df], ignore_index=True)
    
    # Shuffle the dataset to mix fake and real news
    df = df.sample(frac=1).reset_index(drop=True)
    
    return df

# Quick test if you run this file directly
if __name__ == "__main__":
    sample_text = "BREAKING: This is a sample news article! Click here http://fakeurl.com"
    print("Original:", sample_text)
    print("Cleaned:", clean_text(sample_text))
