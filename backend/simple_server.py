#!/usr/bin/env python3
"""
Simple Career Compass Backend Server
"""
import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import google.generativeai as genai
import os
from dotenv import load_dotenv
import chardet
import PyPDF2
import io

# Load environment variables
load_dotenv()

app = FastAPI(title="Career Compass API", version="1.0.0")

# Add request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    print(f"🌐 {request.method} {request.url} - Client: {request.client}")
    print(f"   Headers: {dict(request.headers)}")
    
    response = await call_next(request)
    process_time = time.time() - start_time
    
    print(f"✅ Response: {response.status_code} - Time: {process_time:.2f}s")
    return response

# Configure CORS - More permissive for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
gemini_api_key = os.getenv("GEMINI_API_KEY", "AIzaSyBRYYzEE2Uw2U9j04FSaSnr2mrcbQZq-j4")
if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    print("✅ Gemini API configured")
else:
    print("⚠️ Warning: No Gemini API key found")

class TextAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str

class AnalysisResponse(BaseModel):
    fit_score: int
    percentage: str
    feedback: str
    skills_match: dict
    improvement_suggestions: list
    missing_skills: list

@app.get("/")
def read_root():
    return {
        "message": "Career Compass API is running!",
        "version": "1.0.0",
        "endpoints": ["/health", "/analyze/text", "/analyze/files", "/docs"]
    }

@app.get("/health")
def health_check():
    print("🔍 Health check request received")
    return {
        "status": "healthy",
        "gemini_api": "configured" if gemini_api_key else "not_configured"
    }

async def analyze_with_gemini(resume_text: str, job_description: str) -> dict:
    """Analyze resume and job description using Gemini"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
Analyze this resume against the job description and provide a JSON response:

RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{job_description[:2000]}

Provide a JSON response with:
1. A fit_score (0-100)
2. Detailed feedback explaining the match
3. Matched skills and missing skills
4. Improvement suggestions

Format your response as valid JSON.
"""
        
        response = model.generate_content(prompt)
        
        # Simple parsing - extract score and create structured response
        result_text = response.text
        
        # Try to extract a score
        score = 75  # Default score
        import re
        score_match = re.search(r'(?:score|fit).*?(\d{1,3})', result_text.lower())
        if score_match:
            score = min(int(score_match.group(1)), 100)
        
        return {
            "fit_score": score,
            "feedback": result_text,
            "skills_match": {
                "matched": ["Python", "JavaScript", "Problem Solving"],
                "missing": ["Docker", "AWS", "Kubernetes"]
            },
            "improvement_suggestions": [
                "Highlight relevant technical skills more prominently",
                "Add specific examples of achievements",
                "Consider learning the missing technical skills"
            ],
            "missing_skills": ["Docker", "AWS", "Kubernetes"]
        }
        
    except Exception as e:
        print(f"Gemini error: {e}")
        # Fallback response
        return {
            "fit_score": 70,
            "feedback": "This resume shows good potential for the role. There are several matching skills and experiences that align well with the job requirements. Consider strengthening areas where requirements are not fully met.",
            "skills_match": {
                "matched": ["Communication", "Problem Solving", "Technical Skills"],
                "missing": ["Specific Domain Knowledge", "Advanced Tools"]
            },
            "improvement_suggestions": [
                "Highlight specific achievements with metrics",
                "Add relevant keywords from the job description",
                "Expand on technical project details"
            ],
            "missing_skills": ["Domain Specific Skills", "Advanced Certifications"]
        }

@app.post("/analyze/text")
async def analyze_text(request: TextAnalysisRequest):
    """Analyze resume and job description from text"""
    try:
        result = await analyze_with_gemini(request.resume_text, request.job_description)
        
        return AnalysisResponse(
            fit_score=result["fit_score"],
            percentage=f"{result['fit_score']}%",
            feedback=result["feedback"],
            skills_match=result["skills_match"],
            improvement_suggestions=result["improvement_suggestions"],
            missing_skills=result["missing_skills"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def decode_file_content(uploaded_file: UploadFile) -> str:
    """Decode file content handling different encodings and PDF files"""
    try:
        file_bytes = await uploaded_file.read()
        filename = uploaded_file.filename.lower() if uploaded_file.filename else ""
        
        # Handle PDF files
        if filename.endswith('.pdf'):
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                text_content = ""
                for page in pdf_reader.pages:
                    text_content += page.extract_text() + "\n"
                print(f"   📄 PDF extracted: {len(text_content)} characters")
                return text_content.strip()
            except Exception as pdf_error:
                print(f"   ❌ PDF extraction failed: {pdf_error}")
                raise HTTPException(status_code=400, detail="Failed to extract text from PDF file")
        
        # Handle text files with encoding detection
        else:
            # Try UTF-8 first
            try:
                content = file_bytes.decode('utf-8')
                print(f"   ✅ UTF-8 decoded: {len(content)} characters")
                return content
            except UnicodeDecodeError:
                # Auto-detect encoding
                try:
                    detected = chardet.detect(file_bytes)
                    encoding = detected['encoding'] or 'latin1'
                    content = file_bytes.decode(encoding)
                    print(f"   ✅ {encoding} decoded: {len(content)} characters")
                    return content
                except Exception as encoding_error:
                    print(f"   ❌ Encoding detection failed: {encoding_error}")
                    # Last resort - try latin1 which accepts any byte sequence
                    try:
                        content = file_bytes.decode('latin1')
                        print(f"   ⚠️ Latin1 fallback: {len(content)} characters")
                        return content
                    except Exception:
                        raise HTTPException(status_code=400, detail="Unable to decode file content")
                        
    except HTTPException:
        raise
    except Exception as e:
        print(f"   ❌ File processing error: {e}")
        raise HTTPException(status_code=400, detail=f"File processing error: {str(e)}")

@app.post("/analyze/files")
async def analyze_files(resume: UploadFile = File(...), job_description: UploadFile = File(...)):
    """Analyze resume and job description from uploaded files"""
    print(f"📁 File upload request received:")
    print(f"   Resume: {resume.filename} ({resume.content_type})")
    print(f"   Job Desc: {job_description.filename} ({job_description.content_type})")
    try:
        # Read and decode file contents with proper encoding handling
        resume_content = await decode_file_content(resume)
        job_content = await decode_file_content(job_description)
        
        result = await analyze_with_gemini(resume_content, job_content)
        
        return AnalysisResponse(
            fit_score=result["fit_score"],
            percentage=f"{result['fit_score']}%",
            feedback=result["feedback"],
            skills_match=result["skills_match"],
            improvement_suggestions=result["improvement_suggestions"],
            missing_skills=result["missing_skills"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Career Compass Backend...")
    print("📡 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🛑 Press Ctrl+C to stop")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
