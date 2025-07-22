@echo off
echo 🚀 Starting Career Compass API Server...
echo.

cd /d "%~dp0"
call venv\Scripts\activate.bat

echo ✅ Virtual environment activated
echo ⚡ Starting server on http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 🛑 Press Ctrl+C to stop the server
echo.

python start_server.py

pause
