#!/usr/bin/env python3
"""
Startup script for Career Compass API server
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    print("🚀 Starting Career Compass API Server...")
    print("=" * 50)
    
    # Check if Gemini API key is configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key or gemini_key == "your_gemini_api_key_here":
        print("⚠️  WARNING: Gemini API key not configured!")
        print("   Please edit the .env file and add your API key")
        print("   Get your key from: https://aistudio.google.com/app/apikey")
        print()
    else:
        print("✅ Gemini API key configured")
    
    print("📡 Server will be available at:")
    print("   - Main API: http://localhost:8000")
    print("   - API Docs: http://localhost:8000/docs")
    print("   - Health Check: http://localhost:8000/health")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
