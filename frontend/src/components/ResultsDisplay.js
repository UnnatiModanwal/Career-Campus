import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Divider,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Collapse,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StarIcon from '@mui/icons-material/Star';
import SkillsIcon from '@mui/icons-material/Psychology';
import FeedbackIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import InsightsIcon from '@mui/icons-material/Insights';
import SpeedIcon from '@mui/icons-material/Speed';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '1px solid rgba(0,0,0,0.05)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
  },
}));

const ScoreCard = styled(Card)(({ theme, score }) => {
  let bgColor = '#f44336'; // Red for low scores
  let textColor = '#fff';
  
  if (score >= 80) {
    bgColor = '#4caf50'; // Green for excellent
  } else if (score >= 60) {
    bgColor = '#ff9800'; // Orange for good
  } else if (score >= 40) {
    bgColor = '#ff5722'; // Orange-red for fair
  }
  
  return {
    background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
    color: textColor,
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },
  };
});

const AnalysisCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
  border: '2px solid #e3f2fd',
  borderRadius: '16px',
  overflow: 'visible',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(33, 150, 243, 0.15)',
    borderColor: theme.palette.primary.main,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #2196f3 0%, #21cbf3 50%, #2196f3 100%)',
    borderRadius: '16px 16px 0 0',
  },
}));

const HighlightBox = styled(Box)(({ theme, type }) => {
  const colors = {
    strength: { bg: '#e8f5e8', border: '#4caf50', icon: '#2e7d32' },
    improvement: { bg: '#fff3e0', border: '#ff9800', icon: '#f57c00' },
    concern: { bg: '#ffebee', border: '#f44336', icon: '#d32f2f' },
  };
  
  const color = colors[type] || colors.strength;
  
  return {
    backgroundColor: color.bg,
    border: `2px solid ${color.border}20`,
    borderLeft: `4px solid ${color.border}`,
    borderRadius: '12px',
    padding: theme.spacing(2.5),
    margin: theme.spacing(1.5, 0),
    position: 'relative',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: `0 4px 12px ${color.border}20`,
      transform: 'translateX(4px)',
    },
    '& .highlight-icon': {
      color: color.icon,
    },
  };
});

const ResultsDisplay = ({ results }) => {
  const { fit_score, percentage, feedback, skills_match, improvement_suggestions } = results;
  const [expandedAnalysis, setExpandedAnalysis] = useState(false);
  const [analysisHighlights, setAnalysisHighlights] = useState([]);

  // Extract key insights from feedback
  React.useEffect(() => {
    if (feedback) {
      const highlights = extractKeyInsights(feedback, fit_score);
      setAnalysisHighlights(highlights);
    }
  }, [feedback, fit_score]);

  const extractKeyInsights = (text, score) => {
    const insights = [];
    const lowerText = text.toLowerCase();
    
    // Detect strengths
    const strengthKeywords = ['strong', 'excellent', 'impressive', 'good fit', 'well-suited', 'demonstrates', 'experience', 'skilled'];
    const improvementKeywords = ['however', 'lacks', 'missing', 'could improve', 'should develop', 'limited', 'insufficient'];
    const concernKeywords = ['major gap', 'significantly lacks', 'does not have', 'critical missing', 'inadequate'];
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (strengthKeywords.some(keyword => lowerSentence.includes(keyword))) {
        insights.push({ type: 'strength', content: sentence.trim() });
      } else if (concernKeywords.some(keyword => lowerSentence.includes(keyword))) {
        insights.push({ type: 'concern', content: sentence.trim() });
      } else if (improvementKeywords.some(keyword => lowerSentence.includes(keyword))) {
        insights.push({ type: 'improvement', content: sentence.trim() });
      }
    });
    
    return insights.slice(0, 5); // Limit to top 5 insights
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return 'Excellent Match! 🎉';
    if (score >= 80) return 'Great Match! 🌟';
    if (score >= 70) return 'Good Match! 👍';
    if (score >= 60) return 'Fair Match 👌';
    if (score >= 50) return 'Moderate Match 🤔';
    return 'Needs Improvement 📈';
  };

  const getScoreAdvice = (score) => {
    if (score >= 80) return 'You\'re a strong candidate! Consider applying with confidence.';
    if (score >= 60) return 'You meet most requirements. Focus on highlighting your strengths.';
    if (score >= 40) return 'You have potential. Work on the missing skills to improve your chances.';
    return 'Significant skill gaps exist. Consider developing key missing skills first.';
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'strength': return <CheckCircleIcon className="highlight-icon" />;
      case 'improvement': return <LightbulbIcon className="highlight-icon" />;
      case 'concern': return <CancelIcon className="highlight-icon" />;
      default: return <InsightsIcon className="highlight-icon" />;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
          📊 Analysis Results
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered analysis of your resume and job description match
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Fit Score Card */}
        <Grid item xs={12} md={4}>
          <ScoreCard score={fit_score}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <TrendingUpIcon sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
              <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                {percentage}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Match Score
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {getScoreLabel(fit_score)}
              </Typography>
            </CardContent>
          </ScoreCard>
        </Grid>

        {/* Quick Summary */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <StarIcon color="primary" /> Quick Assessment
              </Typography>
              
              <Alert 
                severity={fit_score >= 70 ? 'success' : fit_score >= 50 ? 'warning' : 'info'} 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {getScoreAdvice(fit_score)}
                </Typography>
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Match Strength
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={fit_score} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      background: fit_score >= 70 ? 
                        'linear-gradient(90deg, #4caf50 0%, #8bc34a 100%)' :
                        fit_score >= 50 ?
                        'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)' :
                        'linear-gradient(90deg, #f44336 0%, #ff5722 100%)'
                    }
                  }} 
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {fit_score}/100
                </Typography>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Enhanced Detailed Analysis */}
        <Grid item xs={12}>
          <AnalysisCard>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(45deg, #2196f3, #21cbf3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  <AutoAwesomeIcon sx={{ color: '#2196f3', fontSize: 32 }} />
                  AI-Powered Detailed Analysis
                </Typography>
                <Chip 
                  icon={<SpeedIcon />}
                  label="Smart Analysis"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Key Insights Summary */}
              {analysisHighlights.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsightsIcon color="primary" /> Key Insights
                  </Typography>
                  <Grid container spacing={2}>
                    {analysisHighlights.map((highlight, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <HighlightBox type={highlight.type}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            {getInsightIcon(highlight.type)}
                            <Typography variant="body2" sx={{ lineHeight: 1.6, flexGrow: 1 }}>
                              {highlight.content}
                            </Typography>
                          </Box>
                        </HighlightBox>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Full Analysis Toggle */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FeedbackIcon color="primary" /> Complete Analysis Report
                  </Typography>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={() => setExpandedAnalysis(!expandedAnalysis)}
                    endIcon={expandedAnalysis ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    {expandedAnalysis ? 'Show Less' : 'Show Full Report'}
                  </Button>
                </Box>
                
                <Collapse in={expandedAnalysis} timeout={600}>
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'linear-gradient(145deg, #f8f9fa 0%, #ffffff 100%)', 
                    borderRadius: 3,
                    border: '1px solid #e0e0e0',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8, 
                      whiteSpace: 'pre-line',
                      fontSize: '1rem',
                      color: 'text.primary'
                    }}>
                      {feedback}
                    </Typography>
                  </Paper>
                </Collapse>
                
                {!expandedAnalysis && (
                  <Paper sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(33, 150, 243, 0.04)', 
                    borderRadius: 3,
                    border: '1px solid rgba(33, 150, 243, 0.1)'
                  }}>
                    <Typography variant="body1" sx={{ 
                      lineHeight: 1.8,
                      color: 'text.primary',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {feedback}
                    </Typography>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Click "Show Full Report" above to read the complete analysis
                      </Typography>
                    </Box>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </AnalysisCard>
        </Grid>

        {/* Skills Match */}
        {skills_match && (
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SkillsIcon color="success" /> Skills Analysis
                </Typography>
                
                {/* Matched Skills */}
                {skills_match.matched && skills_match.matched.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'success.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" /> Matched Skills ({skills_match.matched.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {skills_match.matched.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="success"
                          variant="outlined"
                          size="small"
                          icon={<CheckCircleIcon />}
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                {/* Missing Skills */}
                {skills_match.missing && skills_match.missing.length > 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CancelIcon fontSize="small" /> Skills to Develop ({skills_match.missing.length})
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {skills_match.missing.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          color="error"
                          variant="outlined"
                          size="small"
                          icon={<CancelIcon />}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
        )}

        {/* Improvement Suggestions */}
        {improvement_suggestions && improvement_suggestions.length > 0 && (
          <Grid item xs={12} md={6}>
            <StyledCard>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon color="warning" /> Improvement Tips
                </Typography>
                
                <List dense>
                  {improvement_suggestions.map((suggestion, index) => (
                    <ListItem key={index} sx={{ px: 0, alignItems: 'flex-start' }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                        <LightbulbIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={suggestion}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: '0.95rem',
                            lineHeight: 1.5,
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </StyledCard>
          </Grid>
        )}

        {/* Action Items */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 Next Steps
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'primary.contrastText', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      📝 Update Resume
                    </Typography>
                    <Typography variant="body2">
                      Highlight the matched skills and address missing ones
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      📚 Skill Development
                    </Typography>
                    <Typography variant="body2">
                      Focus on learning the missing technical skills
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'warning.contrastText', textAlign: 'center', borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      🚀 Apply Strategically
                    </Typography>
                    <Typography variant="body2">
                      Tailor your application to emphasize strengths
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsDisplay;
