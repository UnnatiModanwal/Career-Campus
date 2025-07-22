# Career Compass

Career Compass is an intelligent web application that leverages advanced AI to help job seekers optimize their resumes. By analyzing and comparing your resume with job descriptions, it provides a personalized compatibility score, highlights matched and missing skills, and offers actionable improvement tips—empowering you to land your ideal job faster and with greater confidence.

## Tech Stack
- **Backend:** FastAPI (Python), Google Gemini AI, PyPDF2
- **Frontend:** React, Material-UI

## How to Run
1. **Backend:**
   - `cd backend`
   - `python -m venv venv && venv\Scripts\activate` (Windows)
   - `pip install -r requirements.txt`
   - Set your Google Gemini API key in a `.env` file
   - `python start_server.py`
2. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm start`

Visit [http://localhost:3000](http://localhost:3000) to use the app.
