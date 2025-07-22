#!/usr/bin/env python3
"""
Test script for Career Compass API
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_endpoint():
    """Test the health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_text_analysis():
    """Test text-based analysis"""
    print("\n🔍 Testing text analysis endpoint...")
    
    # Sample data
    resume_text = """
    JOHN SMITH
    Software Engineer
    
    SUMMARY
    Experienced software engineer with 5+ years developing web applications using Python, JavaScript, and React.
    
    TECHNICAL SKILLS
    - Programming Languages: Python, JavaScript, HTML/CSS, SQL
    - Frameworks: React, Flask, Django, Node.js
    - Databases: PostgreSQL, MongoDB, MySQL
    """
    
    job_description = """
    SENIOR FULL STACK DEVELOPER
    
    We are seeking a Senior Full Stack Developer with expertise in Python backend development and React frontend.
    
    REQUIRED QUALIFICATIONS
    - 4+ years of experience in full-stack web development
    - Proficiency in Python (Django or Flask framework)
    - Strong knowledge of JavaScript and React
    - Experience with PostgreSQL or similar databases
    """
    
    payload = {
        "resume_text": resume_text,
        "job_description": job_description
    }
    
    try:
        response = requests.post(f"{BASE_URL}/analyze/text", json=payload)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Analysis Results:")
            print(f"   Fit Score: {result['percentage']}")
            print(f"   Feedback: {result['feedback'][:100]}...")
            return True
        else:
            print(f"❌ Error Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_file_analysis():
    """Test file-based analysis"""
    print("\n🔍 Testing file analysis endpoint...")
    
    try:
        files = {
            'resume': ('resume.txt', open('dummy_resume.txt', 'rb')),
            'job_description': ('job.txt', open('dummy_jd.txt', 'rb'))
        }
        
        response = requests.post(f"{BASE_URL}/analyze/files", files=files)
        print(f"Status Code: {response.status_code}")
        
        # Close files
        files['resume'][1].close()
        files['job_description'][1].close()
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Analysis Results:")
            print(f"   Fit Score: {result['percentage']}")
            print(f"   Feedback: {result['feedback'][:100]}...")
            return True
        else:
            print(f"❌ Error Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Testing Career Compass API")
    print("=" * 50)
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    if not health_ok:
        print("❌ Health check failed. Make sure the server is running.")
        return
    
    # Test endpoints
    text_ok = test_text_analysis()
    file_ok = test_file_analysis()
    
    print("\n" + "=" * 50)
    print("📊 Test Summary:")
    print(f"   Health Check: {'✅' if health_ok else '❌'}")
    print(f"   Text Analysis: {'✅' if text_ok else '❌'}")
    print(f"   File Analysis: {'✅' if file_ok else '❌'}")
    
    if all([health_ok, text_ok, file_ok]):
        print("\n🎉 All tests passed!")
    else:
        print("\n⚠️  Some tests failed. Check the logs above.")

if __name__ == "__main__":
    main()
