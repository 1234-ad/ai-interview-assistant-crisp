import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  candidates: [],
  selectedCandidate: null,
  searchTerm: '',
  sortBy: 'score', // score, name, date
  sortOrder: 'desc' // asc, desc
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      const candidate = {
        id: action.payload.sessionId,
        ...action.payload.candidateInfo,
        questions: action.payload.questions,
        answers: action.payload.answers,
        score: action.payload.finalScore || 0,
        summary: action.payload.summary || '',
        startTime: action.payload.startTime,
        endTime: action.payload.endTime,
        status: 'completed',
        createdAt: new Date().toISOString()
      };
      
      // Remove existing candidate with same ID if exists
      state.candidates = state.candidates.filter(c => c.id !== candidate.id);
      state.candidates.push(candidate);
    },
    
    updateCandidate: (state, action) => {
      const index = state.candidates.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.candidates[index] = { ...state.candidates[index], ...action.payload };
      }
    },
    
    setSelectedCandidate: (state, action) => {
      state.selectedCandidate = action.payload;
    },
    
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    
    deleteCandidate: (state, action) => {
      state.candidates = state.candidates.filter(c => c.id !== action.payload);
      if (state.selectedCandidate?.id === action.payload) {
        state.selectedCandidate = null;
      }
    },
    
    clearAllCandidates: (state) => {
      state.candidates = [];
      state.selectedCandidate = null;
    }
  }
});

export const {
  addCandidate,
  updateCandidate,
  setSelectedCandidate,
  setSearchTerm,
  setSortBy,
  setSortOrder,
  deleteCandidate,
  clearAllCandidates
} = candidatesSlice.actions;

export default candidatesSlice.reducer;