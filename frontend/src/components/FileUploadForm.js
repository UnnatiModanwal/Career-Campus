import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import axios from 'axios';

const DropzoneArea = styled(Paper)(({ theme, isDragActive, hasFile }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[300]}`,
  borderRadius: 12,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? theme.palette.primary.light + '20' : 
                   hasFile ? theme.palette.success.light + '20' : 
                   theme.palette.grey[50],
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.light + '10',
  },
}));

const FileUploadForm = ({ onAnalysisStart, onAnalysisComplete, onAnalysisError, loading }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescriptionFile, setJobDescriptionFile] = useState(null);

  // Resume dropzone - simplified configuration
  const resumeDropzone = useDropzone({
    accept: '.pdf,.txt',
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      console.log('Resume files:', acceptedFiles, rejectedFiles);
      if (acceptedFiles.length > 0) {
        setResumeFile(acceptedFiles[0]);
        console.log('Resume file set:', acceptedFiles[0].name);
      }
      if (rejectedFiles.length > 0) {
        onAnalysisError('Please upload only PDF or TXT files.');
      }
    },
  });

  // Job description dropzone - simplified configuration
  const jobDescriptionDropzone = useDropzone({
    accept: '.pdf,.txt',
    maxFiles: 1,
    multiple: false,
    onDrop: (acceptedFiles, rejectedFiles) => {
      console.log('Job description files:', acceptedFiles, rejectedFiles);
      if (acceptedFiles.length > 0) {
        setJobDescriptionFile(acceptedFiles[0]);
        console.log('Job description file set:', acceptedFiles[0].name);
      }
      if (rejectedFiles.length > 0) {
        onAnalysisError('Please upload only PDF or TXT files.');
      }
    },
  });

  const handleRemoveFile = (fileType) => {
    if (fileType === 'resume') {
      setResumeFile(null);
    } else {
      setJobDescriptionFile(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescriptionFile) {
      onAnalysisError('Please upload both resume and job description files.');
      return;
    }

    console.log('Starting analysis with files:', {
      resume: resumeFile.name,
      jobDescription: jobDescriptionFile.name,
      resumeSize: resumeFile.size,
      jobDescSize: jobDescriptionFile.size
    });

    onAnalysisStart();

    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jobDescriptionFile);

    try {
      console.log('Sending request to backend...');
      const response = await axios.post('http://127.0.0.1:8000/analyze/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout
      });

      console.log('Analysis response:', response.data);
      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      
      let errorMessage = 'Failed to analyze files. Please try again.';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. The analysis is taking too long.';
      } else if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Make sure the backend server is running on port 8000.';
      } else if (error.response) {
        errorMessage = error.response.data?.detail || `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'No response from server. Make sure the backend is running.';
      }
      
      onAnalysisError(errorMessage);
    }
  };

  const FileDisplay = ({ file, onRemove, label, icon: Icon }) => (
    <Box sx={{ mt: 2 }}>
      <Chip
        icon={<Icon />}
        label={`${label}: ${file.name}`}
        onDelete={onRemove}
        deleteIcon={<DeleteIcon />}
        sx={{
          maxWidth: '100%',
          height: 'auto',
          '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
            padding: '8px 0',
          },
        }}
        color="success"
        variant="outlined"
      />
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        {formatFileSize(file.size)}
      </Typography>
    </Box>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Resume Upload */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            📄 Upload Resume
          </Typography>
          <DropzoneArea
            {...resumeDropzone.getRootProps()}
            isDragActive={resumeDropzone.isDragActive}
            hasFile={!!resumeFile}
          >
            <input {...resumeDropzone.getInputProps()} />
            <CloudUploadIcon 
              sx={{ 
                fontSize: 48, 
                color: resumeFile ? 'success.main' : 'text.secondary',
                mb: 1 
              }} 
            />
            <Typography variant="body1" gutterBottom>
              {resumeDropzone.isDragActive
                ? 'Drop your resume here...'
                : resumeFile
                ? 'Resume uploaded successfully!'
                : 'Drag & drop your resume or click to browse'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, TXT
            </Typography>
          </DropzoneArea>
          
          {resumeFile && (
            <FileDisplay
              file={resumeFile}
              onRemove={() => handleRemoveFile('resume')}
              label="Resume"
              icon={DescriptionIcon}
            />
          )}
        </Grid>

        {/* Job Description Upload */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            💼 Upload Job Description
          </Typography>
          <DropzoneArea
            {...jobDescriptionDropzone.getRootProps()}
            isDragActive={jobDescriptionDropzone.isDragActive}
            hasFile={!!jobDescriptionFile}
          >
            <input {...jobDescriptionDropzone.getInputProps()} />
            <CloudUploadIcon 
              sx={{ 
                fontSize: 48, 
                color: jobDescriptionFile ? 'success.main' : 'text.secondary',
                mb: 1 
              }} 
            />
            <Typography variant="body1" gutterBottom>
              {jobDescriptionDropzone.isDragActive
                ? 'Drop job description here...'
                : jobDescriptionFile
                ? 'Job description uploaded successfully!'
                : 'Drag & drop job description or click to browse'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF, TXT
            </Typography>
          </DropzoneArea>
          
          {jobDescriptionFile && (
            <FileDisplay
              file={jobDescriptionFile}
              onRemove={() => handleRemoveFile('jobDescription')}
              label="Job Description"
              icon={DescriptionIcon}
            />
          )}
        </Grid>
      </Grid>

      {/* Progress Bar */}
      {loading && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            🤖 AI is analyzing your files... This may take a few moments.
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
          disabled={!resumeFile || !jobDescriptionFile || loading}
          startIcon={<AnalyticsIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            boxShadow: '0 3px 5px 2px rgba(25, 118, 210, .3)',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Match'}
        </Button>
      </Box>

      {/* Tips */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.contrastText' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          💡 Tips for better results:
        </Typography>
        <Typography variant="body2" component="div">
          • Use clear, well-formatted documents<br />
          • Include specific skills and experience details<br />
          • Ensure job descriptions are detailed and comprehensive
        </Typography>
      </Box>
    </Box>
  );
};

export default FileUploadForm;
