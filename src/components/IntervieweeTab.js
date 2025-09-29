import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Card, 
  Button, 
  Input, 
  Form, 
  Typography, 
  Progress, 
  Space,
  Spin,
  message
} from 'antd';
import { 
  startNewSession, 
  setResumeData, 
  setCandidateInfo, 
  startInterview,
  setTimeRemaining,
  submitAnswer,
  completeInterview
} from '../store/slices/interviewSlice';
import { addCandidate } from '../store/slices/candidatesSlice';
import ResumeUpload from './ResumeUpload';
import ChatInterface from './ChatInterface';
import Timer from './Timer';
import { generateInterviewQuestions, evaluateAnswer, generateFinalSummary } from '../utils/aiService';

const { Title, Text } = Typography;

const IntervieweeTab = () => {
  const dispatch = useDispatch();
  const { 
    stage, 
    candidateInfo, 
    questions, 
    currentQuestion, 
    answers,
    timeRemaining,
    isActive,
    sessionId
  } = useSelector(state => state.interview);
  
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const timerRef = useRef(null);

  // Timer effect
  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      handleTimeUp();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isActive, timeRemaining, dispatch]);

  const handleStartNewSession = () => {
    dispatch(startNewSession());
  };

  const handleResumeUpload = (resumeData) => {
    dispatch(setResumeData(resumeData));
  };

  const handleInfoSubmit = async (values) => {
    const updatedInfo = { ...candidateInfo, ...values };
    dispatch(setCandidateInfo(updatedInfo));
    
    // Check if all required fields are present
    if (updatedInfo.name && updatedInfo.email && updatedInfo.phone) {
      setLoading(true);
      try {
        const interviewQuestions = await generateInterviewQuestions(updatedInfo.resumeText);
        dispatch(startInterview(interviewQuestions));
        message.success('Interview started! Good luck!');
      } catch (error) {
        message.error('Failed to generate questions. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) {
      message.warning('Please provide an answer before submitting.');
      return;
    }

    setLoading(true);
    const timeUsed = getTimeUsed();
    
    try {
      const evaluation = await evaluateAnswer(
        questions[currentQuestion], 
        currentAnswer, 
        timeUsed
      );
      
      setEvaluations(prev => [...prev, evaluation]);
      
      dispatch(submitAnswer({
        answer: currentAnswer,
        timeUsed
      }));
      
      setCurrentAnswer('');
      
      // Check if interview is complete
      if (currentQuestion === questions.length - 1) {
        await handleInterviewComplete([...evaluations, evaluation]);
      }
    } catch (error) {
      message.error('Failed to evaluate answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = async () => {
    const timeUsed = getTimeUsed();
    const answer = currentAnswer || 'No answer provided (time expired)';
    
    setLoading(true);
    try {
      const evaluation = await evaluateAnswer(
        questions[currentQuestion], 
        answer, 
        timeUsed
      );
      
      setEvaluations(prev => [...prev, evaluation]);
      
      dispatch(submitAnswer({
        answer,
        timeUsed
      }));
      
      setCurrentAnswer('');
      
      if (currentQuestion === questions.length - 1) {
        await handleInterviewComplete([...evaluations, evaluation]);
      }
    } catch (error) {
      message.error('Failed to process answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewComplete = async (allEvaluations) => {
    setLoading(true);
    try {
      const summary = await generateFinalSummary(questions, answers, allEvaluations);
      
      dispatch(completeInterview({
        score: summary.score,
        summary: summary.summary
      }));
      
      // Add candidate to the dashboard
      dispatch(addCandidate({
        sessionId,
        candidateInfo,
        questions,
        answers: [...answers, { 
          questionIndex: currentQuestion, 
          answer: currentAnswer || 'No answer provided (time expired)',
          timeUsed: getTimeUsed(),
          timestamp: new Date().toISOString()
        }],
        finalScore: summary.score,
        summary: summary.summary,
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString()
      }));
      
      message.success(`Interview completed! Your score: ${summary.score}/${summary.maxScore}`);
    } catch (error) {
      message.error('Failed to complete interview.');
    } finally {
      setLoading(false);
    }
  };

  const getTimeUsed = () => {
    const currentQ = questions[currentQuestion];
    if (!currentQ) return 0;
    
    const timeLimit = currentQ.difficulty === 'easy' ? 20 : 
                     currentQ.difficulty === 'medium' ? 60 : 120;
    return timeLimit - timeRemaining;
  };

  const getMissingFields = () => {
    const missing = [];
    if (!candidateInfo.name) missing.push('name');
    if (!candidateInfo.email) missing.push('email');
    if (!candidateInfo.phone) missing.push('phone');
    return missing;
  };

  const renderUploadStage = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Title level={2}>Welcome to AI Interview Assistant</Title>
        <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: '30px' }}>
          Upload your resume to get started with the Full Stack Developer interview
        </Text>
        
        {!sessionId ? (
          <Button 
            type="primary" 
            size="large" 
            onClick={handleStartNewSession}
            style={{ marginBottom: '30px' }}
          >
            Start New Interview
          </Button>
        ) : (
          <ResumeUpload onUpload={handleResumeUpload} />
        )}
      </div>
    </Card>
  );

  const renderInfoCollectionStage = () => {
    const missingFields = getMissingFields();
    
    return (
      <Card>
        <Title level={3}>Complete Your Information</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: '20px' }}>
          We need some additional information before starting the interview.
        </Text>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleInfoSubmit}
          initialValues={candidateInfo}
        >
          {missingFields.includes('name') && (
            <Form.Item
              label="Full Name"
              name="name"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input placeholder="Enter your full name" size="large" />
            </Form.Item>
          )}
          
          {missingFields.includes('email') && (
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter your email address" size="large" />
            </Form.Item>
          )}
          
          {missingFields.includes('phone') && (
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="Enter your phone number" size="large" />
            </Form.Item>
          )}
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              loading={loading}
              block
            >
              Start Interview
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  const renderInterviewStage = () => (
    <div>
      <Timer 
        timeRemaining={timeRemaining}
        difficulty={questions[currentQuestion]?.difficulty}
      />
      
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Progress 
            percent={((currentQuestion + 1) / questions.length) * 100}
            format={() => `${currentQuestion + 1}/${questions.length}`}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
          />
          <Text type="secondary" style={{ display: 'block', marginTop: '10px' }}>
            Question {currentQuestion + 1} of {questions.length} • 
            {questions[currentQuestion]?.difficulty.toUpperCase()} Level
          </Text>
        </div>
        
        <Title level={4} style={{ marginBottom: '20px' }}>
          {questions[currentQuestion]?.question}
        </Title>
        
        <Input.TextArea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          rows={6}
          style={{ marginBottom: '20px' }}
        />
        
        <Space>
          <Button 
            type="primary" 
            onClick={handleAnswerSubmit}
            loading={loading}
            disabled={!currentAnswer.trim()}
          >
            Submit Answer
          </Button>
          <Text type="secondary">
            Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </Text>
        </Space>
      </Card>
    </div>
  );

  const renderCompletedStage = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <Title level={2} style={{ color: '#52c41a' }}>
          🎉 Interview Completed!
        </Title>
        <Text style={{ fontSize: '16px', display: 'block', marginBottom: '20px' }}>
          Thank you for completing the interview. Your responses have been recorded.
        </Text>
        
        <Button 
          type="primary" 
          size="large" 
          onClick={handleStartNewSession}
        >
          Start New Interview
        </Button>
      </div>
    </Card>
  );

  if (loading && stage === 'interview') {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <Text style={{ display: 'block', marginTop: '20px' }}>
          Processing your answer...
        </Text>
      </div>
    );
  }

  return (
    <div>
      {stage === 'upload' && renderUploadStage()}
      {stage === 'info-collection' && renderInfoCollectionStage()}
      {stage === 'interview' && renderInterviewStage()}
      {stage === 'completed' && renderCompletedStage()}
    </div>
  );
};

export default IntervieweeTab;