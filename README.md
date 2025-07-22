# 🎯 Career Compass - AI Resume Analyzer

**Career Compass** is an intelligent AI-powered resume analysis tool that helps job seekers optimize their resumes by comparing them against job descriptions. Get instant compatibility scores, detailed feedback, and personalized improvement suggestions.

![Career Compass Banner](https://img.shields.io/badge/AI%20Powered-Resume%20Analyzer-blue?style=for-the-badge&logo=artificial-intelligence)

## ✨ Features

### 🤖 **AI-Powered Analysis**
- **Google Gemini Integration** - Advanced AI analysis for accurate results
- **Smart Compatibility Scoring** - Get percentage match scores (0-100%)
- **Intelligent Insights** - Automatic extraction of key strengths and concerns
- **Contextual Recommendations** - Personalized improvement suggestions

### 🎨 **Beautiful User Interface**
- **Modern React Design** - Material-UI components with premium styling
- **Interactive Analysis Display** - Color-coded insights with smooth animations
- **Progressive Disclosure** - Expandable detailed reports
- **Responsive Layout** - Works perfectly on desktop and mobile

### 📁 **Flexible Input Methods**
- **File Upload** - Support for PDF and TXT files
- **Direct Text Input** - Copy and paste resume/job description text
- **Robust File Handling** - Handles multiple character encodings (UTF-8, Latin-1, CP1252)

### 📊 **Comprehensive Analysis**
- **Skills Matching** - Identifies matched and missing skills
- **Fit Score** - Overall compatibility percentage
- **Detailed Feedback** - In-depth AI analysis of your profile
- **Improvement Tips** - Actionable suggestions for resume enhancement

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **Google Gemini API Key** ([Get yours here](https://aistudio.google.com/app/apikey))

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/UnnatiModanwal/Career-Campus.git
   cd Career-Campus
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   ```

3. **Configure API Key**
   ```bash
   # Create .env file in backend directory
   echo GEMINI_API_KEY=your_gemini_api_key_here > .env
   ```

4. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### 🚀 Launch Application

**Option 1: One-Click Launch (Windows)**
```bash
.\LAUNCH.bat
```

**Option 2: Manual Launch**
```bash
# Terminal 1 - Backend
cd backend
python start_server.py

# Terminal 2 - Frontend
cd frontend
npm start
```

### 📍 Access Points
- **Main Application**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🛠 Tech Stack

### **Backend**
- **FastAPI** - Modern, fast web framework for building APIs
- **Google Gemini AI** - Advanced language model for analysis
- **PyPDF2** - PDF text extraction
- **Uvicorn** - ASGI web server
- **Python-dotenv** - Environment variable management

### **Frontend**
- **React** - Modern UI library
- **Material-UI (MUI)** - Premium component library
- **JavaScript (ES6+)** - Modern JavaScript features
- **CSS-in-JS** - Styled components for dynamic styling

## 📁 Project Structure

```
career-compass/
├── 📁 backend/                 # FastAPI Backend
│   ├── 📁 venv/               # Python virtual environment
│   ├── 📄 main.py             # Main FastAPI application
│   ├── 📄 start_server.py     # Server startup script
│   ├── 📄 requirements.txt    # Python dependencies
│   ├── 📄 .env                # Environment variables
│   └── 📄 quick_test.py       # API testing script
├── 📁 frontend/               # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/     # React components
│   │   │   ├── 📄 CareerCompass.js      # Main component
│   │   │   ├── 📄 FileUploadForm.js     # File upload handler
│   │   │   ├── 📄 TextInputForm.js      # Text input handler
│   │   │   └── 📄 ResultsDisplay.js     # Enhanced results display
│   │   ├── 📄 App.js          # App entry point
│   │   └── 📄 index.js        # React DOM render
│   ├── 📄 package.json        # Node.js dependencies
│   └── 📁 public/             # Static assets
├── 📄 LAUNCH.bat              # Windows launcher script
├── 📄 README.md               # This file
└── 📄 PROJECT_STATUS.md       # Development status
```

## 🎯 How It Works

1. **Choose Input Method** - Upload files or paste text directly
2. **AI Analysis** - Google Gemini analyzes resume against job description
3. **Smart Insights** - Key strengths, concerns, and improvements are extracted
4. **Interactive Results** - View summary insights or expand for full detailed report
5. **Actionable Feedback** - Get specific recommendations to improve your resume

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|--------------|
| `/` | GET | Welcome message and API info |
| `/health` | GET | Health check and API status |
| `/analyze/files` | POST | Analyze uploaded resume + JD files |
| `/analyze/text` | POST | Analyze resume + JD as text |
| `/docs` | GET | Interactive API documentation |

## 📊 Sample Response

```json
{
  "fit_score": 85,
  "percentage": "85%",
  "feedback": "Detailed AI analysis of the resume-job fit...",
  "skills_match": {
    "matched": ["Python", "JavaScript", "React"],
    "missing": ["Docker", "AWS"]
  },
  "improvement_suggestions": [
    "Add experience with containerization tools",
    "Highlight cloud computing experience"
  ]
}
```

## 🎨 Screenshots

### Main Interface
![Main Interface](https://img.shields.io/badge/Interface-Modern%20%26%20Clean-brightgreen)

### Enhanced Analysis Display
- **Color-coded insights** with smooth animations
- **Expandable reports** for detailed analysis
- **Interactive elements** with hover effects
- **Professional styling** with gradient backgrounds
