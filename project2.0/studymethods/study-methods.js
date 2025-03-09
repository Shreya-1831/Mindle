document.addEventListener('DOMContentLoaded', function() {
  // Theme switcher functionality
  const lightThemeBtn = document.getElementById('light-theme');
  const darkThemeBtn = document.getElementById('dark-theme');
  
  lightThemeBtn.addEventListener('click', function() {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    localStorage.setItem('theme', 'light');
  });
  
  darkThemeBtn.addEventListener('click', function() {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  });
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  }
  
  // Study methods data
  const studyMethods = [
    { 
      name: "Pomodoro Technique", 
      description: "Work in focused intervals with short breaks to enhance productivity.", 
      category: "time-management",
      fullDescription: "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as 'pomodoros', the plural in English of the Italian word pomodoro (tomato), after the tomato-shaped kitchen timer that Francesco Cirillo used as a university student.",
      url: "methods/pomodoro/index.html",
      benefits: [
        "Increases focus and concentration",
        "Reduces mental fatigue",
        "Helps manage distractions",
        "Improves work quality",
        "Creates a sense of accomplishment"
      ],
      steps: [
        "Choose a task to work on",
        "Set a timer for 25 minutes (one pomodoro)",
        "Work on the task until the timer rings",
        "Take a short 5-minute break",
        "After four pomodoros, take a longer 15-30 minute break"
      ]
    },
    { 
      name: "Feynman Technique", 
      description: "Learn by explaining concepts in simple terms to reinforce understanding.", 
      category: "comprehension",
      fullDescription: "The Feynman Technique is a learning method named after physicist Richard Feynman. It involves explaining a concept in simple language as if teaching it to someone else who has no background in the subject. This process helps identify gaps in your understanding and simplifies complex ideas.",
      url: "methods/feynman/index.html",
      benefits: [
        "Identifies knowledge gaps",
        "Deepens understanding of complex topics",
        "Improves ability to communicate ideas",
        "Enhances long-term memory retention",
        "Builds confidence in the subject matter"
      ],
      steps: [
        "Choose a concept to learn",
        "Explain it in simple terms as if teaching a child",
        "Identify gaps in your explanation and review the material",
        "Simplify technical language and create analogies",
        "Review and repeat until you can explain it clearly"
      ]
    },
    { 
      name: "SQ3R Method", 
      description: "Survey, Question, Read, Recite, and Review to enhance comprehension.", 
      category: "comprehension",
      fullDescription: "SQ3R is a reading comprehension method named for its five steps: Survey, Question, Read, Recite, and Review. The method was introduced by Francis P. Robinson in his 1946 book 'Effective Study'. It's designed to help students better understand and retain information from textbooks.",
      benefits: [
        "Improves reading comprehension",
        "Enhances information retention",
        "Creates an active learning environment",
        "Develops critical thinking skills",
        "Saves time when studying complex material"
      ],
      steps: [
        "Survey: Skim the text to get an overview (headings, summaries, etc.)",
        "Question: Formulate questions based on the headings and content",
        "Read: Read the text actively, seeking answers to your questions",
        "Recite: After each section, recite the main points in your own words",
        "Review: After finishing, review the material to ensure understanding"
      ]
    },
    { 
      name: "Active Recall", 
      description: "Test yourself frequently instead of passively rereading notes.", 
      category: "memorization",
      fullDescription: "Active recall is a learning principle that involves actively stimulating memory during the learning process. It's one of the most effective learning strategies, requiring you to retrieve information from memory rather than simply rereading or reviewing it passively.",
      url: "methods/active-recall/index.html",
      benefits: [
        "Strengthens neural connections in the brain",
        "Significantly improves long-term retention",
        "Identifies weak areas in your knowledge",
        "Prepares you for test-like situations",
        "More effective than passive studying methods"
      ],
      steps: [
        "Study the material initially to understand it",
        "Close your notes and try to recall the information",
        "Test yourself by writing down or explaining what you remember",
        "Check your answers against your notes",
        "Focus more time on information you couldn't recall"
      ]
    },
    { 
      name: "Mind Mapping", 
      description: "Create visual diagrams to understand relationships between concepts.", 
      category: "note-taking",
      fullDescription: "Mind mapping is a visual thinking tool that helps structure information by showing connections between concepts. It starts with a central idea and branches out into related subtopics, creating a radial, hierarchical structure that mimics how our brains naturally organize information.",
      url: "methods/pomodoro/index.html",
      benefits: [
        "Organizes information visually and hierarchically",
        "Helps see connections between different concepts",
        "Enhances creativity and problem-solving",
        "Improves memory through visual associations",
        "Makes complex information more digestible"
      ],
      steps: [
        "Start with a central idea in the middle of a blank page",
        "Draw branches from the center for main subtopics",
        "Add smaller branches for related details",
        "Use colors, images, and symbols to enhance memory",
        "Review and revise your mind map as you learn more"
      ]
    },
    { 
      name: "Interleaved Learning", 
      description: "Mix multiple subjects in a study session for better retention.", 
      category: "time-management",
      fullDescription: "Interleaved learning involves mixing different topics or types of problems within a single study session, rather than focusing on one topic at a time (blocked practice). Research shows this approach leads to better long-term retention and ability to discriminate between different types of problems.",
      benefits: [
        "Improves ability to distinguish between problem types",
        "Enhances long-term retention",
        "Develops flexible thinking skills",
        "Prevents illusion of mastery from blocked practice",
        "Better prepares for real-world application of knowledge"
      ],
      steps: [
        "Identify different subjects or problem types to study",
        "Instead of studying one topic for a long period, alternate between topics",
        "Spend 20-30 minutes on one subject before switching",
        "Create a study schedule that mixes related but different topics",
        "Review all subjects regularly to maintain connections"
      ]
    },
    { 
      name: "Leitner System", 
      description: "Use flashcards and spaced repetition for efficient memorization.", 
      img: "leitner.png",
      category: "memorization",
      fullDescription: "The Leitner System is a method of efficiently using flashcards based on spaced repetition. Cards are sorted into groups according to how well you know each one. The cards you know well are reviewed less frequently, while difficult cards are reviewed more often.",
      benefits: [
        "Optimizes study time by focusing on difficult material",
        "Implements spaced repetition automatically",
        "Provides a systematic approach to flashcard review",
        "Adapts to your learning progress",
        "Works well for vocabulary, definitions, and facts"
      ],
      steps: [
        "Create flashcards with questions on one side and answers on the other",
        "Set up 3-5 boxes or categories for sorting cards",
        "Start with all cards in Box 1 (review daily)",
        "If you answer correctly, move the card to the next box (reviewed less frequently)",
        "If you answer incorrectly, move the card back to Box 1"
      ]
    },
    { 
      name: "Spaced Repetition", 
      description: "Review information at increasing intervals to boost long-term retention.", 
      category: "memorization",
      fullDescription: "Spaced repetition is a learning technique that involves reviewing information at systematically increasing intervals. It's based on the psychological spacing effect, which demonstrates that information is better retained when studied multiple times spaced over a longer period rather than all at once.",
      benefits: [
        "Dramatically improves long-term retention",
        "Reduces total study time needed",
        "Combats the forgetting curve",
        "Works with any subject matter",
        "Can be implemented with digital tools or manually"
      ],
      steps: [
        "Learn the material initially until you understand it",
        "Review after 1 day",
        "Review again after 3 days",
        "Then after 7 days, 14 days, and 30 days",
        "Adjust intervals based on how easily you recall the information"
      ]
    },
    { 
      name: "Cornell Note-Taking", 
      description: "Divide notes into key points, summaries, and details for better recall.", 
      category: "note-taking",
      fullDescription: "The Cornell Note-Taking System is a method for taking, organizing, and reviewing notes. The page is divided into three sections: a narrow left column for cues/questions, a wider right column for notes, and a bottom section for summarizing the main ideas. This format promotes active engagement with the material.",
      benefits: [
        "Organizes notes in a structured, logical format",
        "Facilitates active review through the question column",
        "Encourages summarization of key concepts",
        "Reduces time needed to study for exams",
        "Improves critical thinking about the material"
      ],
      steps: [
        "Divide your paper into three sections: cues, notes, and summary",
        "Take notes in the right column during class or reading",
        "After class, write questions or cues in the left column",
        "Write a brief summary at the bottom of the page",
        "When studying, cover the notes column and answer the questions"
      ]
    },
    { 
      name: "Metacognition", 
      description: "Reflect on your learning process to improve study effectiveness.", 
      category: "comprehension",
      fullDescription: "Metacognition is 'thinking about thinking' or being aware of your own thought processes. In studying, it involves planning how to approach a learning task, monitoring comprehension, and evaluating progress. This awareness allows you to adjust strategies to improve learning outcomes.",
      benefits: [
        "Increases awareness of learning strengths and weaknesses",
        "Helps select the most effective study strategies",
        "Improves problem-solving abilities",
        "Develops self-regulated learning skills",
        "Leads to deeper understanding of material"
      ],
      steps: [
        "Before studying, plan your approach and set specific goals",
        "During study, monitor your understanding and attention",
        "Ask yourself questions like 'Do I understand this?' and 'How does this connect to what I already know?'",
        "After studying, evaluate how well you learned the material",
        "Reflect on what strategies worked best and adjust for next time"
      ]
    }
  ];
  
  // Function to render study methods
  function renderMethods(methods) {
    const container = document.getElementById('methods-container');
    container.innerHTML = '';
    
    methods.forEach(method => {
      // Create placeholder image URL using method name
      const imgUrl = `https://source.unsplash.com/random/300x200/?study,${method.name.toLowerCase().replace(/\s+/g, '')}`;
      
      const methodCard = document.createElement('div');
      methodCard.className = 'col-md-6 col-lg-4';
      methodCard.innerHTML = `
        <div class="method-card" data-method="${method.name}">
          <img src="${imgUrl}" class="method-image w-100" alt="${method.name}">
          <div class="method-details">
            <h3>${method.name}</h3>
            <p>${method.description}</p>
            <button class="btn btn-outline-primary learn-more-btn" data-method="${method.name}">Learn More</button>
          </div>
        </div>
      `;
      container.appendChild(methodCard);
    });
    
    // Add event listeners to the learn more buttons
    document.querySelectorAll('.learn-more-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const methodName = this.getAttribute('data-method');
        openMethodModal(methodName);
      });
    });
    
    // Add event listeners to the method cards
    document.querySelectorAll('.method-card').forEach(card => {
      card.addEventListener('click', function(e) {
        // Only trigger if the click wasn't on the button
        if (!e.target.classList.contains('learn-more-btn')) {
          const methodName = this.getAttribute('data-method');
          openMethodModal(methodName);
        }
      });
    });
  }
  
  // Function to open method modal
  function openMethodModal(methodName) {
    const method = studyMethods.find(m => m.name === methodName);
    if (!method) return;
    
    // Create placeholder image URL using method name
    const imgUrl = `https://source.unsplash.com/random/600x400/?study,${method.name.toLowerCase().replace(/\s+/g, '')}`;
    
    document.getElementById('method-modal-title').textContent = method.name;
    document.getElementById('method-modal-image').src = imgUrl;
    document.getElementById('method-modal-description').textContent = method.fullDescription;
    
    // Populate benefits
    const benefitsList = document.getElementById('method-benefits');
    benefitsList.innerHTML = '';
    method.benefits.forEach(benefit => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${benefit}`;
      benefitsList.appendChild(li);
    });
    
    // Populate steps
    const stepsList = document.getElementById('method-steps');
    stepsList.innerHTML = '';
    method.steps.forEach((step, index) => {
      const li = document.createElement('li');
      li.innerHTML = `<div class="step-number">${index + 1}</div><div>${step}</div>`;
      stepsList.appendChild(li);
    });
    
    // Show the modal
    const methodModal = new bootstrap.Modal(document.getElementById('methodModal'));
    methodModal.show();
  }
  
  // Filter functionality
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active button
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      let filteredMethods;
      
      if (filter === 'all') {
        filteredMethods = studyMethods;
      } else {
        filteredMethods = studyMethods.filter(method => method.category === filter);
      }
      
      renderMethods(filteredMethods);
    });
  });
  
  // Try method button functionality
  document.getElementById('try-method-btn').addEventListener('click', function() {
    const methodName = document.getElementById('method-modal-title').textContent;
    const method = studyMethods.find(m => m.name === methodName);
    if (method) {
      const methodUrl = method.url;  // Get the URL of the method
      if (methodUrl) {
        window.location.href = methodUrl;  // Redirect to the method's page
      }
    }
  });  
  
  // Initial render
  renderMethods(studyMethods);
});