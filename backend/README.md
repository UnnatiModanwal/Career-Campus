# Career Compass Backend API

A FastAPI-based backend service that uses Google Gemini AI to analyze resume-job description fit and provide actionable feedback.

## 🚀 Features

- **Resume Analysis**: Upload resume files (PDF/TXT) or paste text directly
- **Job Description Analysis**: Compare against job requirements
- **AI-Powered Scoring**: Get percentage fit scores with detailed explanations
- **Skills Gap Analysis**: Identify missing skills and improvement suggestions
- **Multiple Input Formats**: Support for PDF and text file uploads
- **RESTful API**: Clean, documented API endpoints

## 🛠️ Setup Instructions

### 1. Environment Setup

Make sure you have Python 3.8+ installed, then activate your virtual environment:

```bash
# Windows (PowerShell)
.\venv\Scripts\Activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Google Gemini API

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Edit the `.env` file and replace `your_gemini_api_key_here` with your actual API key:

```bash
GEMINI_API_KEY=AIza...your_actual_key_here
```

### 4. Start the Server

```bash
# Option 1: Using the startup script
python start_server.py

# Option 2: Direct uvicorn command
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start at `http://localhost:8000`

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Analyze Files
```http
POST /analyze/files
Content-Type: multipart/form-data

Parameters:
- resume: file (PDF or TXT)
- job_description: file (PDF or TXT)
```

### Analyze Text
```http
POST /analyze/text
Content-Type: application/json

{
    "resume_text": "Your resume content here...",
    "job_description": "Job description content here..."
}
```

### API Documentation
- Interactive docs: `http://localhost:8000/docs`
- OpenAPI schema: `http://localhost:8000/openapi.json`

## 🧪 Testing

Run the test script to verify everything works:

```bash
# Make sure the server is running first
python test_api.py
```

Or test with sample files:

```bash
# Using curl (if you have it)
curl -X POST "http://localhost:8000/analyze/files" \
  -H "accept: application/json" \
  -F "resume=@dummy_resume.txt" \
  -F "job_description=@dummy_jd.txt"
```

## 📝 Response Format

```json
{
    "fit_score": 85,
    "percentage": "85%",
    "feedback": "Detailed analysis of the resume-job fit...",
    "skills_match": {
        "matched": ["Python", "JavaScript", "React"],
        "missing": ["Docker", "AWS"]
    },
    "improvement_suggestions": [
        "Add experience with containerization tools like Docker",
        "Highlight cloud computing experience"
    ],
    "missing_skills": ["Docker", "AWS", "Redis"]
}
```

## 🏗️ Architecture

- **FastAPI**: Modern Python web framework for APIs
- **Google Gemini**: AI model for resume analysis
- **PyPDF2**: PDF text extraction
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for production

## 🔧 Configuration

Key environment variables in `.env`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚨 Troubleshooting

### Common Issues

1. **"Gemini API key not configured"**
   - Make sure you've set `GEMINI_API_KEY` in `.env`
   - Verify the key is valid at Google AI Studio

2. **"Module not found" errors**
   - Ensure virtual environment is activated
   - Run `pip install -r requirements.txt`

3. **PDF upload issues**
   - Ensure PDF files are text-based (not scanned images)
   - Try with TXT files first for testing

4. **CORS errors from frontend**
   - Frontend origins are configured in `main.py`
   - Add your frontend URL to the `origins` list

### Debug Mode

For detailed logging, set the log level:

```bash
uvicorn main:app --log-level debug
```

## 🤝 API Usage Examples

### Python

```python
import requests

# Text analysis
response = requests.post(
    "http://localhost:8000/analyze/text",
    json={
        "resume_text": "Your resume here...",
        "job_description": "Job description here..."
    }
)

result = response.json()
print(f"Fit Score: {result['percentage']}")
```

### JavaScript

```javascript
// File upload
const formData = new FormData();
formData.append('resume', resumeFile);
formData.append('job_description', jobFile);

fetch('http://localhost:8000/analyze/files', {
    method: 'POST',
    body: formData
})
.then(response => response.json())
.then(data => console.log('Fit Score:', data.percentage));
```

## 📚 Next Steps

1. **Get your Gemini API key** from Google AI Studio
2. **Configure the `.env` file** with your API key
3. **Start the server** with `python start_server.py`
4. **Test the API** with the provided test script
5. **Build your frontend** to consume the API

Happy coding! 🎉
