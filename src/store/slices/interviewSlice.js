import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentCandidate: null,
  currentQuestion: 0,
  questions: [],
  answers: [],
  timeRemaining: 0,
  isActive: false,
  isPaused: false,
  stage: 'upload', // upload, info-collection, interview, completed
  candidateInfo: {
    name: '',
    email: '',
    phone: '',
    resumeText: ''
  },
  sessionId: null,
  startTime: null,
  endTime: null
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    startNewSession: (state, action) => {
      const sessionId = Date.now().toString();
      state.sessionId = sessionId;
      state.currentCandidate = sessionId;
      state.stage = 'upload';
      state.currentQuestion = 0;
      state.questions = [];
      state.answers = [];
      state.timeRemaining = 0;
      state.isActive = false;
      state.isPaused = false;
      state.candidateInfo = {
        name: '',
        email: '',
        phone: '',
        resumeText: ''
      };
      state.startTime = new Date().toISOString();
      state.endTime = null;
    },
    
    setResumeData: (state, action) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
      state.stage = 'info-collection';
    },
    
    setCandidateInfo: (state, action) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
    },
    
    startInterview: (state, action) => {
      state.questions = action.payload;
      state.stage = 'interview';
      state.currentQuestion = 0;
      state.isActive = true;
      state.isPaused = false;
      // Set timer based on difficulty
      const difficulty = action.payload[0]?.difficulty || 'easy';
      state.timeRemaining = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;
    },
    
    setTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
    },
    
    submitAnswer: (state, action) => {
      const answer = {
        questionIndex: state.currentQuestion,
        answer: action.payload.answer,
        timeUsed: action.payload.timeUsed,
        timestamp: new Date().toISOString()
      };
      state.answers.push(answer);
      
      // Move to next question or complete
      if (state.currentQuestion < state.questions.length - 1) {
        state.currentQuestion += 1;
        const nextDifficulty = state.questions[state.currentQuestion]?.difficulty || 'easy';
        state.timeRemaining = nextDifficulty === 'easy' ? 20 : nextDifficulty === 'medium' ? 60 : 120;
      } else {
        state.stage = 'completed';
        state.isActive = false;
        state.endTime = new Date().toISOString();
      }
    },
    
    pauseInterview: (state) => {
      state.isPaused = true;
      state.isActive = false;
    },
    
    resumeInterview: (state) => {
      state.isPaused = false;
      state.isActive = true;
    },
    
    completeInterview: (state, action) => {
      state.stage = 'completed';
      state.isActive = false;
      state.endTime = new Date().toISOString();
      if (action.payload) {
        state.finalScore = action.payload.score;
        state.summary = action.payload.summary;
      }
    },
    
    resetInterview: (state) => {
      return initialState;
    }
  }
});

export const {
  startNewSession,
  setResumeData,
  setCandidateInfo,
  startInterview,
  setTimeRemaining,
  submitAnswer,
  pauseInterview,
  resumeInterview,
  completeInterview,
  resetInterview
} = interviewSlice.actions;

export default interviewSlice.reducer;