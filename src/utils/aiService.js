// AI Service for generating questions and evaluating answers
// This is a mock implementation - in production, you'd integrate with OpenAI, Anthropic, or similar

const FULL_STACK_QUESTIONS = {
  easy: [
    {
      id: 1,
      question: "What is the difference between let, const, and var in JavaScript?",
      difficulty: "easy",
      expectedAnswer: "var is function-scoped, let and const are block-scoped. const cannot be reassigned.",
      category: "JavaScript Fundamentals"
    },
    {
      id: 2,
      question: "Explain what React components are and the difference between functional and class components.",
      difficulty: "easy",
      expectedAnswer: "Components are reusable UI elements. Functional components use hooks, class components use lifecycle methods.",
      category: "React Basics"
    },
    {
      id: 3,
      question: "What is the purpose of package.json in a Node.js project?",
      difficulty: "easy",
      expectedAnswer: "package.json contains project metadata, dependencies, scripts, and configuration.",
      category: "Node.js Basics"
    }
  ],
  medium: [
    {
      id: 4,
      question: "Explain the concept of closures in JavaScript with an example.",
      difficulty: "medium",
      expectedAnswer: "Closures allow inner functions to access outer function variables even after outer function returns.",
      category: "JavaScript Advanced"
    },
    {
      id: 5,
      question: "How does React's virtual DOM work and what are its benefits?",
      difficulty: "medium",
      expectedAnswer: "Virtual DOM is a JavaScript representation of real DOM. It enables efficient updates through diffing algorithm.",
      category: "React Advanced"
    },
    {
      id: 6,
      question: "What are middleware functions in Express.js and how do you use them?",
      difficulty: "medium",
      expectedAnswer: "Middleware functions execute during request-response cycle. They can modify req/res objects or end the cycle.",
      category: "Node.js/Express"
    }
  ],
  hard: [
    {
      id: 7,
      question: "Implement a debounce function in JavaScript and explain when you would use it.",
      difficulty: "hard",
      expectedAnswer: "Debounce delays function execution until after a specified time has passed since last invocation.",
      category: "JavaScript Expert"
    },
    {
      id: 8,
      question: "Explain React's reconciliation algorithm and how keys help in list rendering.",
      difficulty: "hard",
      expectedAnswer: "Reconciliation compares virtual DOM trees. Keys help React identify which items changed, added, or removed.",
      category: "React Expert"
    },
    {
      id: 9,
      question: "Design a scalable REST API architecture for a social media platform. What considerations would you make?",
      difficulty: "hard",
      expectedAnswer: "Consider authentication, rate limiting, caching, database design, microservices, load balancing.",
      category: "System Design"
    }
  ]
};

export const generateInterviewQuestions = async (resumeText) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Select 2 questions from each difficulty level
  const selectedQuestions = [
    ...getRandomQuestions(FULL_STACK_QUESTIONS.easy, 2),
    ...getRandomQuestions(FULL_STACK_QUESTIONS.medium, 2),
    ...getRandomQuestions(FULL_STACK_QUESTIONS.hard, 2)
  ];
  
  return selectedQuestions;
};

const getRandomQuestions = (questions, count) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const evaluateAnswer = async (question, answer, timeUsed) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock evaluation logic
  const answerLength = answer.trim().length;
  const timeBonus = calculateTimeBonus(question.difficulty, timeUsed);
  
  let baseScore = 0;
  
  // Simple scoring based on answer length and keywords
  if (answerLength < 20) {
    baseScore = 2;
  } else if (answerLength < 100) {
    baseScore = 5;
  } else if (answerLength < 200) {
    baseScore = 7;
  } else {
    baseScore = 8;
  }
  
  // Check for relevant keywords
  const keywords = extractKeywords(question.expectedAnswer);
  const answerLower = answer.toLowerCase();
  const keywordMatches = keywords.filter(keyword => 
    answerLower.includes(keyword.toLowerCase())
  ).length;
  
  const keywordBonus = Math.min(keywordMatches * 0.5, 2);
  
  const finalScore = Math.min(Math.max(baseScore + keywordBonus + timeBonus, 0), 10);
  
  return {
    score: Math.round(finalScore * 10) / 10,
    feedback: generateFeedback(finalScore, question.difficulty),
    keywordMatches,
    timeBonus
  };
};

const calculateTimeBonus = (difficulty, timeUsed) => {
  const timeLimit = difficulty === 'easy' ? 20 : difficulty === 'medium' ? 60 : 120;
  const timeRatio = timeUsed / timeLimit;
  
  if (timeRatio < 0.5) return 1; // Answered quickly
  if (timeRatio < 0.8) return 0.5; // Good timing
  return 0; // Used most/all time
};

const extractKeywords = (expectedAnswer) => {
  // Simple keyword extraction
  return expectedAnswer.split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'boy', 'did', 'she', 'use', 'way', 'who', 'oil', 'sit', 'set'].includes(word.toLowerCase())
  );
};

const generateFeedback = (score, difficulty) => {
  if (score >= 8) {
    return `Excellent answer! You demonstrated strong understanding of this ${difficulty} level concept.`;
  } else if (score >= 6) {
    return `Good answer! You covered the main points for this ${difficulty} level question.`;
  } else if (score >= 4) {
    return `Decent attempt. Consider elaborating more on the key concepts for ${difficulty} level questions.`;
  } else {
    return `This answer needs improvement. Try to provide more detailed explanations for ${difficulty} level concepts.`;
  }
};

export const generateFinalSummary = async (questions, answers, evaluations) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const totalScore = evaluations.reduce((sum, eval) => sum + eval.score, 0);
  const averageScore = totalScore / evaluations.length;
  const maxScore = questions.length * 10;
  const percentage = (totalScore / maxScore) * 100;
  
  // Analyze performance by difficulty
  const easyQuestions = questions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
  const hardQuestions = questions.filter(q => q.difficulty === 'hard');
  
  const easyScores = evaluations.slice(0, easyQuestions.length);
  const mediumScores = evaluations.slice(easyQuestions.length, easyQuestions.length + mediumQuestions.length);
  const hardScores = evaluations.slice(easyQuestions.length + mediumQuestions.length);
  
  const easyAvg = easyScores.reduce((sum, eval) => sum + eval.score, 0) / easyScores.length;
  const mediumAvg = mediumScores.reduce((sum, eval) => sum + eval.score, 0) / mediumScores.length;
  const hardAvg = hardScores.reduce((sum, eval) => sum + eval.score, 0) / hardScores.length;
  
  let summary = `Candidate completed the full-stack developer interview with an overall score of ${totalScore.toFixed(1)}/${maxScore} (${percentage.toFixed(1)}%). `;
  
  if (percentage >= 80) {
    summary += "Excellent performance across all difficulty levels. Strong candidate for the role.";
  } else if (percentage >= 65) {
    summary += "Good performance with solid understanding of core concepts. Suitable for the role with some areas for growth.";
  } else if (percentage >= 50) {
    summary += "Average performance. Shows basic understanding but needs improvement in several areas.";
  } else {
    summary += "Below average performance. Significant gaps in fundamental concepts that need addressing.";
  }
  
  summary += ` Performance breakdown: Easy (${easyAvg.toFixed(1)}/10), Medium (${mediumAvg.toFixed(1)}/10), Hard (${hardAvg.toFixed(1)}/10).`;
  
  return {
    score: Math.round(totalScore * 10) / 10,
    maxScore,
    percentage: Math.round(percentage * 10) / 10,
    summary,
    breakdown: {
      easy: Math.round(easyAvg * 10) / 10,
      medium: Math.round(mediumAvg * 10) / 10,
      hard: Math.round(hardAvg * 10) / 10
    }
  };
};