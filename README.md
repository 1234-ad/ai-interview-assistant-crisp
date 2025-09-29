# AI Interview Assistant - Crisp

An intelligent interview platform built with React that provides AI-powered interview assistance for both candidates and interviewers. This application features resume parsing, timed interviews, real-time evaluation, and comprehensive candidate management.

## 🚀 Live Demo

**[View Live Demo](https://ai-interview-assistant-crisp.vercel.app)** *(Deploy link will be available after deployment)*

## 📹 Demo Video

**[Watch Demo Video](https://youtu.be/demo-video-link)** *(Video link will be available after recording)*

## ✨ Features

### 🎯 Core Functionality
- **Dual Interface**: Separate tabs for Interviewee (chat) and Interviewer (dashboard)
- **Resume Upload**: Support for PDF and DOCX files with automatic text extraction
- **Smart Data Extraction**: Automatically extracts Name, Email, and Phone from resumes
- **Missing Field Collection**: Chatbot prompts for any missing information before starting
- **Timed Interviews**: 6 questions with difficulty-based timers (Easy: 20s, Medium: 60s, Hard: 120s)
- **AI Question Generation**: Dynamic full-stack developer questions
- **Real-time Evaluation**: AI-powered answer scoring and feedback
- **Local Persistence**: All data saved locally with session restoration
- **Welcome Back Modal**: Resume interrupted sessions seamlessly

### 📊 Interview Flow
1. **Resume Upload**: Drag-and-drop PDF/DOCX files
2. **Information Verification**: Complete missing candidate details
3. **Timed Interview**: 6 questions (2 Easy → 2 Medium → 2 Hard)
4. **Auto-submission**: Questions auto-submit when time expires
5. **AI Evaluation**: Real-time scoring and feedback
6. **Final Summary**: Comprehensive candidate assessment

### 🎛️ Dashboard Features
- **Candidate List**: Sortable table with scores and details
- **Search & Filter**: Find candidates by name or email
- **Detailed View**: Complete interview history and AI analysis
- **Statistics**: Overview of interview metrics
- **Data Management**: Delete individual candidates or clear all data

## 🛠️ Tech Stack

- **Frontend**: React 18, Redux Toolkit, Ant Design
- **State Management**: Redux with Redux Persist
- **Styling**: Ant Design + Custom CSS
- **File Processing**: Custom PDF/DOCX text extraction
- **AI Integration**: Mock AI service (easily replaceable with OpenAI/Anthropic)
- **Persistence**: LocalStorage with Redux Persist
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/1234-ad/ai-interview-assistant-crisp.git
   cd ai-interview-assistant-crisp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── IntervieweeTab.js    # Main interview interface
│   ├── InterviewerTab.js    # Dashboard for interviewers
│   ├── ResumeUpload.js      # File upload component
│   ├── Timer.js             # Interview timer
│   ├── ChatInterface.js     # Chat UI component
│   └── WelcomeBackModal.js  # Session restoration modal
├── store/               # Redux store and slices
│   ├── store.js            # Store configuration
│   └── slices/
│       ├── interviewSlice.js   # Interview state management
│       └── candidatesSlice.js  # Candidate data management
├── utils/               # Utility functions
│   ├── resumeParser.js     # Resume text extraction
│   └── aiService.js        # AI question generation & evaluation
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles
```

## 🎮 Usage Guide

### For Candidates (Interviewee Tab)

1. **Start Interview**
   - Click "Start New Interview"
   - Upload your resume (PDF or DOCX)
   - Complete any missing information

2. **During Interview**
   - Read each question carefully
   - Type your answer in the text area
   - Watch the timer (color-coded: Green → Orange → Red)
   - Submit before time runs out (auto-submits at 0:00)

3. **After Interview**
   - View your final score
   - Start a new interview if desired

### For Interviewers (Dashboard Tab)

1. **View Candidates**
   - See all completed interviews
   - Sort by score, name, or date
   - Search by name or email

2. **Candidate Details**
   - Click "View" to see full interview
   - Review all questions and answers
   - Read AI-generated summary

3. **Data Management**
   - Delete individual candidates
   - Clear all data when needed

## 🔧 Configuration

### AI Service Integration

The application uses a mock AI service by default. To integrate with real AI APIs:

1. **OpenAI Integration**
   ```javascript
   // In src/utils/aiService.js
   import OpenAI from 'openai';
   
   const openai = new OpenAI({
     apiKey: process.env.REACT_APP_OPENAI_API_KEY,
   });
   ```

2. **Environment Variables**
   ```bash
   # Create .env file
   REACT_APP_OPENAI_API_KEY=your_api_key_here
   REACT_APP_AI_MODEL=gpt-3.5-turbo
   ```

### Customization Options

- **Question Bank**: Modify `FULL_STACK_QUESTIONS` in `aiService.js`
- **Timer Durations**: Adjust time limits in interview slice
- **Scoring Algorithm**: Update evaluation logic in AI service
- **UI Theme**: Customize Ant Design theme in `index.js`

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Environment Variables**
   - Add API keys in Vercel dashboard
   - Configure build settings if needed

### Netlify Deployment

1. **Build and Deploy**
   ```bash
   npm run build
   # Upload dist folder to Netlify
   ```

2. **Continuous Deployment**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `build`

## 🧪 Testing

### Manual Testing Checklist

- [ ] Resume upload (PDF/DOCX)
- [ ] Data extraction accuracy
- [ ] Missing field collection
- [ ] Timer functionality
- [ ] Auto-submission
- [ ] Score calculation
- [ ] Session persistence
- [ ] Welcome back modal
- [ ] Dashboard filtering
- [ ] Candidate details view

### Test Data

Use the provided sample resumes in the `test-data/` folder for testing different scenarios.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Swipe** for the internship opportunity and project requirements
- **Ant Design** for the excellent UI component library
- **Redux Toolkit** for simplified state management
- **React Community** for the amazing ecosystem

## 📞 Contact

**Developer**: [Your Name]
- **Email**: your.email@example.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]

---

**Built with ❤️ for Swipe Internship Assignment**

*This project demonstrates proficiency in React, Redux, UI/UX design, file processing, AI integration, and modern web development practices.*