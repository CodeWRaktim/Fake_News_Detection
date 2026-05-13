# How to Run the Fake News Detector

You will need to open **two separate terminal windows** inside your `FAKE_ML` project folder.

### Terminal 1: Start the Backend (Flask API)
```powershell
# 1. Activate the virtual environment
.\venv\Scripts\Activate.ps1

# 2. Navigate to the backend folder
cd backend

# 3. Run the Flask server
python .\app.py
```
> The backend will start on **http://127.0.0.1:5000**

### Terminal 2: Start the Frontend (React + Vite)
```powershell
# 1. Navigate to the frontend folder
cd frontend

# 2. Start the Vite dev server
npm run dev
```
> The frontend will start on **http://localhost:5173**

### Open the App
Once both terminals are running, open your browser and go to:
👉 **http://localhost:5173/**
