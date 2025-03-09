// Store questions and answers
let questions = [
  { question: "What is active recall?", answer: "A learning technique that involves actively stimulating memory during the learning process." },
  { question: "What is spaced repetition?", answer: "A learning technique that involves reviewing information at increasing intervals." },
  { question: "What is the Feynman Technique?", answer: "A learning technique that involves explaining a concept in simple terms to better understand it." },
  { question: "What is the Pomodoro Technique?", answer: "A time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks." },
  { question: "What is metacognition?", answer: "Awareness and understanding of one's own thought processes." }
];

// Current flashcard index
let currentCardIndex = 0;

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const lightThemeBtn = document.getElementById('light-theme');
  const darkThemeBtn = document.getElementById('dark-theme');
  const neonThemeBtn = document.getElementById('neon-theme');
  
  if (lightThemeBtn) {
    lightThemeBtn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-bs-theme', 'light');
      document.body.classList.remove('neon-theme');
      localStorage.setItem('theme', 'light');
    });
  }
  
  if (darkThemeBtn) {
    darkThemeBtn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.remove('neon-theme');
      localStorage.setItem('theme', 'dark');
    });
  }
  
  if (neonThemeBtn) {
    neonThemeBtn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('neon-theme');
      localStorage.setItem('theme', 'neon');
    });
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'neon') {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.body.classList.add('neon-theme');
  } else {
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }

  // Self-Testing functionality
  const saveQABtn = document.getElementById('save-qa-btn');
  if (saveQABtn) {
    saveQABtn.addEventListener('click', () => {
      const question = document.getElementById('question').value.trim();
      const answer = document.getElementById('answer').value.trim();
      
      if (question && answer) {
        questions.push({ question, answer });
        
        // Show success message
        const resultElement = document.getElementById('result');
        resultElement.textContent = 'Question saved successfully!';
        resultElement.className = 'mt-3 result-correct';
        
        // Clear inputs
        document.getElementById('question').value = '';
        document.getElementById('answer').value = '';
        
        // Hide message after 3 seconds
        setTimeout(() => {
          resultElement.textContent = '';
          resultElement.className = 'mt-3';
        }, 3000);
      } else {
        // Show error message
        const resultElement = document.getElementById('result');
        resultElement.textContent = 'Please enter both question and answer.';
        resultElement.className = 'mt-3 result-incorrect';
        
        // Hide message after 3 seconds
        setTimeout(() => {
          resultElement.textContent = '';
          resultElement.className = 'mt-3';
        }, 3000);
      }
    });
  }

  const testYourselfBtn = document.getElementById('test-yourself-btn');
  if (testYourselfBtn) {
    testYourselfBtn.addEventListener('click', () => {
      if (questions.length === 0) {
        const resultElement = document.getElementById('result');
        resultElement.textContent = 'No questions available. Please add some questions first.';
        resultElement.className = 'mt-3 result-incorrect';
        return;
      }
      
      // Select a random question
      const randomIndex = Math.floor(Math.random() * questions.length);
      const randomQuestion = questions[randomIndex];
      
      // Update the flashcard
      document.getElementById('flashcard-front').innerHTML = `<p>${randomQuestion.question}</p>`;
      document.getElementById('flashcard-back').innerHTML = `<p>${randomQuestion.answer}</p>`;
      
      // Flip to question side if it was showing answer
      const flashcard = document.querySelector('.flashcard');
      if (flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
      }
      
      // Show a message
      const resultElement = document.getElementById('result');
      resultElement.textContent = 'Test yourself with this question! Click the flashcard to see the answer.';
      resultElement.className = 'mt-3';
    });
  }

  // Flashcard functionality
  const newFlashcardBtn = document.getElementById('new-flashcard-btn');
  if (newFlashcardBtn) {
    newFlashcardBtn.addEventListener('click', () => {
      if (questions.length === 0) {
        return;
      }
      
      // Get next flashcard
      currentCardIndex = (currentCardIndex + 1) % questions.length;
      const nextQuestion = questions[currentCardIndex];
      
      // Update the flashcard
      document.getElementById('flashcard-front').innerHTML = `<p>${nextQuestion.question}</p>`;
      document.getElementById('flashcard-back').innerHTML = `<p>${nextQuestion.answer}</p>`;
      
      // Make sure card is showing question side
      const flashcard = document.querySelector('.flashcard');
      if (flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
      }
    });
  }

  // Write from Memory functionality
  const saveMemoryBtn = document.getElementById('save-memory-btn');
  if (saveMemoryBtn) {
    saveMemoryBtn.addEventListener('click', () => {
      const memoryText = document.getElementById('memory-write').value.trim();
      
      if (memoryText) {
        // Save to localStorage
        const savedMemories = JSON.parse(localStorage.getItem('memories') || '[]');
        savedMemories.push({
          text: memoryText,
          date: new Date().toISOString()
        });
        localStorage.setItem('memories', JSON.stringify(savedMemories));
        
        // Show success message
        alert('Your notes have been saved!');
      } else {
        alert('Please write something before saving.');
      }
    });
  }

  const clearMemoryBtn = document.getElementById('clear-memory-btn');
  if (clearMemoryBtn) {
    clearMemoryBtn.addEventListener('click', () => {
      document.getElementById('memory-write').value = '';
    });
  }

  // Teach the Concept functionality
  const saveTeachingBtn = document.getElementById('save-teaching-btn');
  if (saveTeachingBtn) {
    saveTeachingBtn.addEventListener('click', () => {
      const domain = document.getElementById('teaching-domain').value;
      const explanation = document.getElementById('teaching-area').value.trim();
      
      if (explanation) {
        // Save to localStorage
        const savedTeachings = JSON.parse(localStorage.getItem('teachings') || '[]');
        savedTeachings.push({
          domain,
          explanation,
          date: new Date().toISOString()
        });
        localStorage.setItem('teachings', JSON.stringify(savedTeachings));
        
        // Show success message
        alert(`Your ${domain} explanation has been saved!`);
      } else {
        alert('Please write an explanation before saving.');
      }
    });
  }

  // Practice Questions functionality
  const generateQuestionBtn = document.getElementById('generate-question-btn');
  if (generateQuestionBtn) {
    generateQuestionBtn.addEventListener('click', () => {
      const domain = document.getElementById('question-domain').value;
      const practiceQuestionElement = document.getElementById('practice-question');
      
      // Get questions based on domain
      let questionList;
      
      switch (domain) {
        case 'science':
          questionList = scienceQuestions;
          break;
        case 'history':
          questionList = historyQuestions;
          break;
        case 'math':
          questionList = mathQuestions;
          break;
        case 'language':
          questionList = languageQuestions;
          break;
        case 'technology':
          questionList = technologyQuestions;
          break;
        default:
          questionList = scienceQuestions;
      }
      
      const randomIndex = Math.floor(Math.random() * questionList.length);
      practiceQuestionElement.textContent = questionList[randomIndex];
    });
  }

  // AI Student Chat functionality
  const sendMessageBtn = document.getElementById('send-message-btn');
  const userInput = document.getElementById('user-input');
  
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', sendMessage);
  }
  
  if (userInput) {
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Initialize the page
  // Set initial flashcard
  if (questions.length > 0) {
    const flashcardFront = document.getElementById('flashcard-front');
    const flashcardBack = document.getElementById('flashcard-back');
    
    if (flashcardFront && flashcardBack) {
      flashcardFront.innerHTML = `<p>${questions[0].question}</p>`;
      flashcardBack.innerHTML = `<p>${questions[0].answer}</p>`;
    }
  }
  
  // Generate initial practice question
  const practiceQuestion = document.getElementById('practice-question');
  if (practiceQuestion) {
    const randomIndex = Math.floor(Math.random() * scienceQuestions.length);
    practiceQuestion.textContent = scienceQuestions[randomIndex];
  }
  
  // Load saved memories and teachings from localStorage
  const savedMemories = JSON.parse(localStorage.getItem('memories') || '[]');
  const savedTeachings = JSON.parse(localStorage.getItem('teachings') || '[]');
  
  console.log(`Loaded ${savedMemories.length} saved memories and ${savedTeachings.length} saved teachings`);
});

// Function to flip flashcard
function flipFlashcard() {
  const flashcard = document.querySelector('.flashcard');
  if (flashcard) {
    flashcard.classList.toggle('flipped');
  }
}

// AI Student Chat functionality
const aiResponses = {
  "hello": "Hello! How can I assist you with your studies today?",
  "hi": "Hi there! What would you like to learn about today?",
  "how are you": "I'm just a program, but I'm ready to help you learn! What subject are you studying?",
  "what is active recall": "Active recall is a learning technique that involves actively stimulating your memory during the learning process. Instead of passively reading information, you test yourself by trying to recall it from memory. This strengthens neural connections and improves long-term retention.",
  "what is spaced repetition": "Spaced repetition is a learning technique where you review information at increasing intervals. Instead of cramming all at once, you space out your study sessions, which helps move information from short-term to long-term memory.",
  "how to study better": "To study more effectively: 1) Use active recall to test yourself, 2) Space out your learning with spaced repetition, 3) Teach concepts to others (Feynman Technique), 4) Take breaks using the Pomodoro Technique, 5) Get enough sleep, and 6) Stay hydrated and eat well.",
  "i'm struggling with": "It's normal to struggle sometimes. Try breaking down the concept into smaller parts, and make sure you understand each part before moving on. Also, try explaining it in your own words - this can help identify gaps in your understanding.",
  "help": "I'm here to help! You can ask me about study techniques, specific subjects, or how to approach difficult concepts. What would you like assistance with?",
  "thank you": "You're welcome! Feel free to ask if you need any more help with your studies.",
  "thanks": "You're welcome! Is there anything else you'd like to know?"
};

// Send message function
function sendMessage() {
  const userInput = document.getElementById('user-input');
  if (!userInput || !userInput.value.trim()) return;
  
  const chatBox = document.getElementById('chat-box');
  if (!chatBox) return;
  
  const userInputValue = userInput.value.trim();
  
  // Add user message to chat
  const userMessageElement = document.createElement('div');
  userMessageElement.className = 'chat-message user-message';
  userMessageElement.innerHTML = `<p><strong>You:</strong> ${userInputValue}</p>`;
  chatBox.appendChild(userMessageElement);
  
  // Clear input
  userInput.value = '';
  
  // Show typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'chat-message ai-message';
  typingIndicator.id = 'typing-indicator';
  typingIndicator.innerHTML = `<p><strong>AI Student:</strong> <span class="typing-dots">Thinking</span></p>`;
  chatBox.appendChild(typingIndicator);
  
  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
  
  // Get AI response
  let aiResponse;
  
  // Check for exact matches in predefined responses
  if (aiResponses[userInputValue.toLowerCase()]) {
    aiResponse = aiResponses[userInputValue.toLowerCase()];
  } else {
    // Check for partial matches
    let partialMatch = false;
    for (const key in aiResponses) {
      if (userInputValue.toLowerCase().includes(key)) {
        aiResponse = aiResponses[key];
        partialMatch = true;
        break;
      }
    }
    
    // If no match found, use fallback response
    if (!partialMatch) {
      aiResponse = "I'm not sure about that, but I'm here to help you think it through!";
    }
  }
  
  // Remove typing indicator after a short delay to simulate thinking
  setTimeout(() => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      chatBox.removeChild(indicator);
    }
    
    // Add AI response
    const aiMessageElement = document.createElement('div');
    aiMessageElement.className = 'chat-message ai-message';
    aiMessageElement.innerHTML = `<p><strong>AI Student:</strong> ${aiResponse}</p>`;
    chatBox.appendChild(aiMessageElement);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
    
    // Text-to-speech (if supported)
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(aiResponse);
      speech.lang = 'en-US';
      window.speechSynthesis.speak(speech);
    }
  }, 1000);
}

// Practice Questions
const scienceQuestions = [
  "Explain the difference between mitosis and meiosis.",
  "What are the main components of an atom?",
  "Describe Newton's three laws of motion.",
  "What is the process of photosynthesis?",
  "Explain the water cycle."
];

const historyQuestions = [
  "What were the main causes of World War I?",
  "Describe the impact of the Industrial Revolution.",
  "Who was Alexander the Great and what were his achievements?",
  "What was the significance of the French Revolution?",
  "Explain the fall of the Roman Empire."
];

const mathQuestions = [
  "Explain the Pythagorean theorem and its applications.",
  "What is calculus and why is it important?",
  "Describe the properties of logarithms.",
  "What is the difference between permutation and combination?",
  "Explain the concept of probability."
];

const languageQuestions = [
  "What are the eight parts of speech in English?",
  "Explain the difference between active and passive voice.",
  "What are common literary devices and their purposes?",
  "How does syntax affect meaning in a sentence?",
  "Describe the evolution of the English language."
];

const technologyQuestions = [
  "Explain how the internet works.",
  "What is the difference between artificial intelligence and machine learning?",
  "Describe the components of a computer and their functions.",
  "What is cloud computing and its benefits?",
  "Explain the concept of cybersecurity."
];