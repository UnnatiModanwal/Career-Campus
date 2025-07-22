#!/usr/bin/env python3
"""
Ultra-simple test server to debug network issues
"""
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Very permissive CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Simple test server is running!"}

@app.get("/health")
def health():
    print("🩺 Health check called")
    return {"status": "healthy", "server": "test"}

@app.post("/analyze/files")
async def analyze_files(resume: UploadFile = File(...), job_description: UploadFile = File(...)):
    print(f"📁 Files received: {resume.filename}, {job_description.filename}")
    
    # Simple mock response
    return {
        "fit_score": 80,
        "percentage": "80%",
        "feedback": "Test feedback - your files were processed successfully!",
        "skills_match": {"matched": ["Python"], "missing": ["AI"]},
        "improvement_suggestions": ["Add more details"],
        "missing_skills": ["Machine Learning"]
    }

if __name__ == "__main__":
    print("🚀 Starting Simple Test Server on http://localhost:8001")
    uvicorn.run(app, host="127.0.0.1", port=8001, reload=False)
