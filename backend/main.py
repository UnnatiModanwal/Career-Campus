from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
import PyPDF2
import io
import json
import re

# Load environment variables
load_dotenv()

app = FastAPI(title="Career Compass API", version="1.0.0")

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key or gemini_api_key == "your_gemini_api_key_here":
    print("⚠️  WARNING: Please set your GEMINI_API_KEY in the .env file")
    print("   Get your key from: https://aistudio.google.com/app/apikey")
else:
    genai.configure(api_key=gemini_api_key)
    print("✅ Gemini API configured successfully")

# Pydantic models for request/response
class AnalysisResponse(BaseModel):
    fit_score: int
    percentage: str
    feedback: str
    skills_match: dict
    improvement_suggestions: list
    missing_skills: list

class TextAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

@app.get("/")
def read_root():
    return {
        "message": "Welcome to Career Compass API",
        "version": "1.0.0",
        "endpoints": {
            "analyze_files": "/analyze/files",
            "analyze_text": "/analyze/text",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    gemini_status = "configured" if gemini_api_key and gemini_api_key != "your_gemini_api_key_here" else "not_configured"
    return {
        "status": "healthy",
        "gemini_api": gemini_status
    }

def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

def decode_file_content(file_content: bytes, filename: str) -> str:
    """Decode file content with multiple encoding attempts"""
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            return file_content.decode(encoding)
        except UnicodeDecodeError:
            continue
    
    # If all encodings fail, try with errors='ignore'
    try:
        return file_content.decode('utf-8', errors='ignore')
    except:
        raise HTTPException(status_code=400, detail=f"Unable to decode {filename}. Please ensure it's a valid text file or PDF.")

def parse_gemini_response(response_text: str) -> dict:
    """Parse Gemini response to extract structured data"""
    try:
        # Try to find JSON in the response
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except:
        pass
    
    # Fallback: parse text response
    lines = response_text.split('\n')
    result = {
        "fit_score": 70,
        "feedback": response_text,
        "skills_match": {"matched": [], "missing": []},
        "improvement_suggestions": [],
        "missing_skills": []
    }
    
    # Extract fit score
    for line in lines:
        if "fit score" in line.lower() or "score" in line.lower():
            numbers = re.findall(r'\d+', line)
            if numbers:
                result["fit_score"] = min(int(numbers[0]), 100)
                break
    
    return result

async def analyze_with_gemini(resume_text: str, job_description: str) -> dict:
    """Analyze resume and job description using Gemini"""
    if not gemini_api_key or gemini_api_key == "your_gemini_api_key_here":
        raise HTTPException(
            status_code=500, 
            detail="Gemini API key not configured. Please set GEMINI_API_KEY in .env file"
        )
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
Analyze the following resume against the job description and provide a detailed assessment.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

Provide your analysis in the following JSON format:
{{
    "fit_score": <number between 0-100>,
    "feedback": "<detailed paragraph explaining the fit>",
    "skills_match": {{
        "matched": ["skill1", "skill2"],
        "missing": ["missing_skill1", "missing_skill2"]
    }},
    "improvement_suggestions": [
        "suggestion 1",
        "suggestion 2"
    ],
    "missing_skills": ["skill1", "skill2"]
}}

Focus on:
1. Technical skills alignment
2. Experience relevance
3. Education match
4. Soft skills
5. Specific improvements needed
"""
        
        response = model.generate_content(prompt)
        return parse_gemini_response(response.text)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {str(e)}")

@app.post("/analyze/files", response_model=AnalysisResponse)
async def analyze_resume_files(resume: UploadFile = File(...), job_description: UploadFile = File(...)):
    """Analyze resume and job description from uploaded files"""
    
    try:
        # Read resume content
        resume_content = await resume.read()
        if resume.filename.endswith('.pdf'):
            resume_text = extract_text_from_pdf(resume_content)
        else:
            resume_text = decode_file_content(resume_content, resume.filename)
        
        # Read job description content
        jd_content = await job_description.read()
        if job_description.filename.endswith('.pdf'):
            jd_text = extract_text_from_pdf(jd_content)
        else:
            jd_text = decode_file_content(jd_content, job_description.filename)
        
        # Analyze with Gemini
        analysis = await analyze_with_gemini(resume_text, jd_text)
        
        return AnalysisResponse(
            fit_score=analysis["fit_score"],
            percentage=f"{analysis['fit_score']}%",
            feedback=analysis["feedback"],
            skills_match=analysis["skills_match"],
            improvement_suggestions=analysis["improvement_suggestions"],
            missing_skills=analysis["missing_skills"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_resume_text(request: TextAnalysisRequest):
    """Analyze resume and job description from text input"""
    
    try:
        analysis = await analyze_with_gemini(request.resume_text, request.job_description)
        
        return AnalysisResponse(
            fit_score=analysis["fit_score"],
            percentage=f"{analysis['fit_score']}%",
            feedback=analysis["feedback"],
            skills_match=analysis["skills_match"],
            improvement_suggestions=analysis["improvement_suggestions"],
            missing_skills=analysis["missing_skills"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
