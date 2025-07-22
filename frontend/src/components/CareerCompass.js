import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Fade,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadIcon from '@mui/icons-material/CloudUpload';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FileUploadForm from './FileUploadForm';
import TextInputForm from './TextInputForm';
import ResultsDisplay from './ResultsDisplay';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
  },
}));

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  padding: theme.spacing(4),
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: 16,
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
}));

const CareerCompass = () => {
  const [inputMethod, setInputMethod] = useState(null); // 'file' or 'text'
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMethodSelect = (method) => {
    setInputMethod(method);
    setResults(null);
    setError(null);
  };

  const handleAnalysisComplete = (data) => {
    setResults(data);
    setLoading(false);
    setError(null);
  };

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
    setResults(null);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setError(null);
    setResults(null);
  };

  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 700,
          fontSize: { xs: '2rem', md: '3rem' },
          position: 'relative',
          zIndex: 1
        }}>
          🎯 Find Your Perfect Job Match
        </Typography>
        <Typography variant="h6" sx={{ 
          opacity: 0.9,
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          Upload your resume and job description to get AI-powered insights, 
          compatibility scores, and personalized improvement suggestions.
        </Typography>
      </HeroSection>

      {/* Error Alert */}
      {error && (
        <Fade in={Boolean(error)}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {/* Input Method Selection */}
      {!inputMethod && (
        <Fade in={!inputMethod}>
          <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center' }}>
            <Grid item xs={12} md={6} lg={4}>
              <StyledCard onClick={() => handleMethodSelect('file')}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <UploadIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Upload Files
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Upload PDF or TXT files for analysis
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            
            <Grid item xs={12} md={6} lg={4}>
              <StyledCard onClick={() => handleMethodSelect('text')}>
                <CardContent sx={{ 
                  textAlign: 'center', 
                  py: 4,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white'
                }}>
                  <TextFieldsIcon sx={{ fontSize: 48, mb: 1, opacity: 0.9 }} />
                  <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Paste Text
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Copy and paste text directly
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Input Forms */}
      {inputMethod && (
        <Fade in={Boolean(inputMethod)}>
          <Box>
            <Card sx={{ mb: 4, p: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 3 
              }}>
                <Typography variant="h5" sx={{ 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {inputMethod === 'file' ? (
                    <>
                      <UploadIcon /> File Upload
                    </>
                  ) : (
                    <>
                      <TextFieldsIcon /> Text Input
                    </>
                  )}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="primary" 
                  sx={{ 
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    '&:hover': { opacity: 0.7 }
                  }}
                  onClick={() => setInputMethod(null)}
                >
                  ← Choose Different Method
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {inputMethod === 'file' ? (
                <FileUploadForm
                  onAnalysisStart={handleAnalysisStart}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisError={handleAnalysisError}
                  loading={loading}
                />
              ) : inputMethod === 'text' ? (
                <TextInputForm
                  onAnalysisStart={handleAnalysisStart}
                  onAnalysisComplete={handleAnalysisComplete}
                  onAnalysisError={handleAnalysisError}
                  loading={loading}
                />
              ) : null}
            </Card>
          </Box>
        </Fade>
      )}

      {/* Results Display */}
      {results && (
        <Fade in={Boolean(results)}>
          <Box>
            <ResultsDisplay results={results} />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default CareerCompass;
