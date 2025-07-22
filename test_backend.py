#!/usr/bin/env python3
"""
Quick test script for Career Compass Backend
"""
import requests
import os

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get('http://localhost:8000/health')
        print(f"✅ Health Check: {response.status_code}")
        print(f"   Response: {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
        return False

def test_file_upload():
    """Test file upload with dummy files"""
    try:
        # Use the dummy files
        with open('backend/dummy_resume.txt', 'rb') as resume_file, \
             open('backend/dummy_jd.txt', 'rb') as job_file:
            
            files = {
                'resume': ('resume.txt', resume_file, 'text/plain'),
                'job_description': ('job.txt', job_file, 'text/plain')
            }
            
            print("🔄 Testing file upload...")
            response = requests.post('http://localhost:8000/analyze/files', files=files)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ File Upload: {response.status_code}")
                print(f"   Fit Score: {data['percentage']}")
                print(f"   Feedback: {data['feedback'][:100]}...")
                return True
            else:
                print(f"❌ File Upload Failed: {response.status_code}")
                print(f"   Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ File Upload Exception: {e}")
        return False

def test_text_analysis():
    """Test text analysis endpoint"""
    try:
        data = {
            "resume_text": "John Smith\nSoftware Engineer\nPython, JavaScript, 3 years experience",
            "job_description": "Senior Developer\nRequirements: Python, JavaScript, 2+ years"
        }
        
        print("🔄 Testing text analysis...")
        response = requests.post('http://localhost:8000/analyze/text', json=data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Text Analysis: {response.status_code}")
            print(f"   Fit Score: {result['percentage']}")
            print(f"   Feedback: {result['feedback'][:100]}...")
            return True
        else:
            print(f"❌ Text Analysis Failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Text Analysis Exception: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Career Compass Backend API")
    print("=" * 40)
    
    # Test all endpoints
    health_ok = test_health()
    print()
    
    if health_ok:
        file_ok = test_file_upload()
        print()
        
        text_ok = test_text_analysis()
        print()
        
        if all([health_ok, file_ok, text_ok]):
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("⚠️ Some tests failed. Check the output above.")
    else:
        print("❌ Backend is not responding. Make sure it's running on port 8000.")
