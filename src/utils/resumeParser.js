// Resume parsing utilities
export const parseResumeText = (text) => {
  const result = {
    name: '',
    email: '',
    phone: '',
    resumeText: text
  };

  // Extract email using regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch && emailMatch.length > 0) {
    result.email = emailMatch[0];
  }

  // Extract phone number using regex
  const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch && phoneMatch.length > 0) {
    result.phone = phoneMatch[0];
  }

  // Extract name - look for patterns at the beginning of the resume
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Try to find name in first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i].trim();
    
    // Skip lines that look like headers, emails, phones, or addresses
    if (line.toLowerCase().includes('resume') || 
        line.toLowerCase().includes('curriculum') ||
        line.includes('@') ||
        /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(line) ||
        line.toLowerCase().includes('address') ||
        line.toLowerCase().includes('phone') ||
        line.toLowerCase().includes('email')) {
      continue;
    }
    
    // Look for a line that could be a name (2-4 words, mostly letters)
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const isLikelyName = words.every(word => 
        /^[A-Za-z][A-Za-z.'-]*$/.test(word) && word.length > 1
      );
      
      if (isLikelyName) {
        result.name = line;
        break;
      }
    }
  }

  return result;
};

export const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        
        // For demo purposes, we'll simulate PDF text extraction
        // In a real app, you'd use a library like pdf-parse or PDF.js
        const simulatedText = `
John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

EXPERIENCE
Senior Full Stack Developer at Tech Corp (2021-2023)
- Developed React applications with Node.js backend
- Implemented RESTful APIs and database design
- Led team of 3 developers on multiple projects

Full Stack Developer at StartupXYZ (2019-2021)
- Built responsive web applications using React, Redux
- Developed microservices architecture with Node.js
- Worked with MongoDB, PostgreSQL databases

SKILLS
Frontend: React, Redux, JavaScript, TypeScript, HTML, CSS
Backend: Node.js, Express, Python, Java
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, AWS, Jenkins

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)
        `;
        
        resolve(simulatedText.trim());
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

export const extractTextFromDOCX = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        // For demo purposes, we'll simulate DOCX text extraction
        // In a real app, you'd use a library like mammoth.js
        const simulatedText = `
Jane Smith
Frontend Developer
jane.smith@email.com
+1-555-987-6543

PROFESSIONAL SUMMARY
Experienced Frontend Developer with 4+ years of experience in React, JavaScript, and modern web technologies.

WORK EXPERIENCE
Frontend Developer - WebTech Solutions (2020-Present)
- Developed responsive React applications
- Implemented state management with Redux
- Collaborated with backend teams for API integration

Junior Developer - Digital Agency (2019-2020)
- Created interactive web interfaces
- Worked with HTML, CSS, JavaScript
- Participated in agile development process

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, HTML, CSS, Python
Frameworks: React, Redux, Next.js, Express
Tools: Git, Webpack, npm, VS Code
        `;
        
        resolve(simulatedText.trim());
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
};