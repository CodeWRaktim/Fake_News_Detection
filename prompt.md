Build a complete end-to-end Fake News Detection System using Machine Learning, NLP, Flask API, and a Web Frontend.

PROJECT GOAL:
Create a web application where users can input a news article or news headline, and the backend ML model predicts whether the news is FAKE or REAL.

TECH STACK:
- Python
- Scikit-learn
- NLP
- TF-IDF Vectorization
- Logistic Regression
- Flask
- HTML/CSS/JavaScript
- Joblib (.pkl model saving)
- LIME/SHAP for explainability

FEATURE REQUIREMENTS:

1. MACHINE LEARNING PIPELINE
- Load fake and real news datasets
- Preprocess text:
  - lowercase conversion
  - punctuation removal
  - stopword removal
  - tokenization
- Convert text into TF-IDF vectors
- Train a Logistic Regression classifier
- Evaluate accuracy using train-test split
- Save trained model as:
  - fake_news_model.pkl
  - tfidf_vectorizer.pkl

2. BACKEND API (FLASK)
Create Flask backend with:
- POST endpoint: /predict
- Accept JSON input:
  {
    "news": "news content here"
  }
- Load .pkl model and vectorizer
- Return:
  - prediction (Fake/Real)
  - confidence score

Example response:
{
  "prediction": "Fake",
  "confidence": "94%"
}

3. WEB FRONTEND
Create a responsive modern webpage with:
- Large textarea input for news article
- “Check News” button
- Output section displaying:
  - Fake or Real
  - confidence percentage
  - optional explanation
- Use HTML, CSS, and JavaScript
- Use fetch() API to connect frontend with Flask backend

4. EXPLAINABLE AI
Integrate LIME or SHAP explainability:
- Highlight important words contributing to prediction
- Show why article was classified as fake or real

5. PROJECT STRUCTURE
Generate clean project structure:

Fake-News-Detection/
│
├── backend/
│   ├── app.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── models/
│   ├── fake_news_model.pkl
│   ├── tfidf_vectorizer.pkl
│
├── data/
│
├── preprocess.py
├── train_model.py
├── requirements.txt
├── README.md

6. ADDITIONAL REQUIREMENTS
- Add proper comments in code
- Use modular coding practices
- Include error handling
- Show API testing examples
- Make frontend visually modern
- Keep code beginner-friendly but scalable

7. FUTURE IMPROVEMENTS
Add placeholders/comments for:
- LSTM implementation
- BERT transformer model
- Chrome extension integration
- Deployment using Docker/Render/AWS

OUTPUT FORMAT:
Generate:
- Complete code files
- Folder structure
- Step-by-step setup instructions
- Commands to run locally in VS Code/Cursor
- requirements.txt
- API testing instructions
- Deployment guidance

The final system should allow a user to open a webpage, paste a news article, click a button, and instantly receive a prediction showing whether the news is fake or real using the trained ML model.