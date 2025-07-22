#!/usr/bin/env python3
"""
Quick test to verify the API works
"""
import asyncio
import sys
from main import analyze_with_gemini

async def test_gemini():
    """Test Gemini integration directly"""
    resume_text = """
    JOHN SMITH
    Software Engineer with 5 years of Python and JavaScript experience.
    Skills: Python, JavaScript, React, Flask, PostgreSQL
    """
    
    job_description = """
    Senior Full Stack Developer
    Requirements: Python, JavaScript, React, 4+ years experience
    """
    
    try:
        result = await analyze_with_gemini(resume_text, job_description)
        print("✅ Gemini API Test Successful!")
        print(f"Fit Score: {result['fit_score']}%")
        print(f"Feedback: {result['feedback'][:100]}...")
        return True
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_imports():
    """Test if all imports work"""
    try:
        import google.generativeai as genai
        import fastapi
        import uvicorn
        import PyPDF2
        print("✅ All imports successful!")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

async def main():
    print("🚀 Running Quick Tests for Career Compass API")
    print("=" * 50)
    
    # Test imports
    imports_ok = test_imports()
    
    if not imports_ok:
        print("Please run: pip install -r requirements.txt")
        return
    
    # Test Gemini integration
    gemini_ok = await test_gemini()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Imports: {'✅' if imports_ok else '❌'}")
    print(f"   Gemini API: {'✅' if gemini_ok else '❌'}")
    
    if imports_ok and gemini_ok:
        print("\n🎉 All tests passed! Your API is ready to use.")
        print("\nNext steps:")
        print("1. Start the server: python start_server.py")
        print("2. Visit: http://localhost:8000/docs")
        print("3. Test with: python test_api.py")
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())
