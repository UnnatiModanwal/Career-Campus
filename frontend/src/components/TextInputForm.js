import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  LinearProgress,
  Paper,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import axios from 'axios';

const TextInputForm = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError, loading }) => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) {
      onAnalysisError('Please provide both resume and job description text.');
      return;
    }

    onAnalysisStart();

    try {
      const response = await axios.post('http://127.0.0.1:8000/analyze/text', {
        resume_text: resumeText,
        job_description: jobDescriptionText,
      });

      onAnalysisComplete(response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to analyze text. Please try again.';
      onAnalysisError(errorMessage);
    }
  };

  const handlePasteSample = () => {
    setResumeText(`JOHN SMITH
Software Engineer
Email: john.smith@email.com | Phone: (555) 123-4567

SUMMARY
Experienced software engineer with 5+ years developing web applications using Python, JavaScript, and React. Strong background in backend development with Flask/Django and database management with PostgreSQL.

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, HTML/CSS, SQL
- Frameworks: React, Flask, Django, Node.js
- Databases: PostgreSQL, MongoDB, MySQL
- Tools: Git, Docker, AWS, Linux
- Other: RESTful APIs, Unit Testing, Agile Methodology

PROFESSIONAL EXPERIENCE
Software Engineer - ABC Tech Company (2019-2024)
- Developed and maintained web applications using Python/Django and React
- Built RESTful APIs serving 10k+ daily users
- Collaborated with cross-functional teams in Agile environment
- Optimized database queries reducing load times by 40%

Junior Developer - XYZ Startup (2018-2019)
- Created responsive web interfaces using HTML, CSS, JavaScript
- Assisted in backend development using Flask
- Participated in code reviews and testing

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2014-2018)`);

    setJobDescriptionText(`SENIOR FULL STACK DEVELOPER
Tech Innovations Inc.

JOB DESCRIPTION
We are seeking a Senior Full Stack Developer to join our growing engineering team. The ideal candidate will have strong expertise in Python backend development and modern frontend frameworks, with experience building scalable web applications.

RESPONSIBILITIES
- Design and develop robust web applications using Python (Django/Flask) and React
- Build and maintain RESTful APIs and microservices
- Work with PostgreSQL and Redis for data management
- Collaborate with product team to implement new features
- Write clean, testable code with proper documentation
- Participate in code reviews and maintain coding standards
- Deploy applications using Docker and AWS cloud services

REQUIRED QUALIFICATIONS
- 4+ years of experience in full-stack web development
- Proficiency in Python (Django or Flask framework)
- Strong knowledge of JavaScript and React
- Experience with PostgreSQL or similar databases
- Familiarity with Git version control
- Understanding of RESTful API design principles
- Knowledge of HTML5, CSS3, and responsive design

PREFERRED QUALIFICATIONS
- Experience with AWS cloud services (EC2, S3, RDS)
- Knowledge of Docker containerization
- Familiarity with Redis caching
- Experience with testing frameworks (pytest, Jest)
- Understanding of CI/CD pipelines
- Bachelor's degree in Computer Science or related field

We offer competitive salary, health benefits, and flexible work arrangements.`);
  };

  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Resume Text Input */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              📄 Resume Text
            </Typography>
            <Button
              size="small"
              startIcon={<ContentPasteIcon />}
              onClick={handlePasteSample}
              variant="outlined"
              sx={{ fontSize: '0.8rem' }}
            >
              Paste Sample
            </Button>
          </Box>
          
          <TextField
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            placeholder="Paste your resume content here...

Include:
• Contact information
• Professional summary
• Technical skills
• Work experience
• Education
• Achievements and projects"
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.9rem',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {getWordCount(resumeText)}
            </Typography>
            {resumeText.trim() && (
              <Typography variant="caption" color="success.main">
                ✓ Resume text added
              </Typography>
            )}
          </Box>
        </Grid>

        {/* Job Description Text Input */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            💼 Job Description Text
          </Typography>
          
          <TextField
            multiline
            rows={15}
            fullWidth
            variant="outlined"
            placeholder="Paste the job description here...

Include:
• Job title and company
• Role responsibilities
• Required qualifications
• Preferred skills
• Experience requirements
• Education requirements"
            value={jobDescriptionText}
            onChange={(e) => setJobDescriptionText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.9rem',
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Words: {getWordCount(jobDescriptionText)}
            </Typography>
            {jobDescriptionText.trim() && (
              <Typography variant="caption" color="success.main">
                ✓ Job description added
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            🤖 AI is analyzing your text... This may take a few moments.
          </Alert>
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Box>
      )}

      {/* Analyze Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleAnalyze}
          disabled={!resumeText.trim() || !jobDescriptionText.trim() || loading}
          startIcon={<AnalyticsIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #f093fb 30%, #f5576c 90%)',
            boxShadow: '0 3px 5px 2px rgba(240, 147, 251, .3)',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </Box>

      {/* Tips */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: 'warning.light', color: 'warning.contrastText' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Tips for better text analysis:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" component="div">
              <strong>Resume:</strong><br />
              • Use clear section headers<br />
              • List specific technologies and tools<br />
              • Include quantifiable achievements<br />
              • Mention years of experience
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" component="div">
              <strong>Job Description:</strong><br />
              • Include all required skills<br />
              • Specify experience levels needed<br />
              • Mention preferred qualifications<br />
              • List specific technologies
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default TextInputForm;
