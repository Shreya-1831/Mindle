import './style.css'
import { setupCounter } from './counter.js'

// Study methods data
const studyMethods = [
  { 
    name: "Pomodoro Technique", 
    description: "Work in focused intervals with short breaks to enhance productivity.", 
    icon: "bi-alarm",
    category: "time-management",
    fullDescription: "The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. These intervals are known as 'pomodoros', the plural in English of the Italian word pomodoro (tomato), after the tomato-shaped kitchen timer that Francesco Cirillo used as a university student.",
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
    icon: "bi-chat-quote",
    category: "comprehension",
    fullDescription: "The Feynman Technique is a learning method named after physicist Richard Feynman. It involves explaining a concept in simple language as if teaching it to someone else who has no background in the subject. This process helps identify gaps in your understanding and simplifies complex ideas.",
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
    icon: "bi-book",
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
    icon: "bi-lightning-charge",
    category: "memorization",
    fullDescription: "Active recall is a learning principle that involves actively stimulating memory during the learning process. It's one of the most effective learning strategies, requiring you to retrieve information from memory rather than simply rereading or reviewing it passively.",
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
    icon: "bi-diagram-3",
    category: "note-taking",
    fullDescription: "Mind mapping is a visual thinking tool that helps structure information by showing connections between concepts. It starts with a central idea and branches out into related subtopics, creating a radial, hierarchical structure that mimics how our brains naturally organize information.",
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
    icon: "bi-shuffle",
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
  }
];

document.querySelector('#app').innerHTML = `
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="index.html">
          <i class="bi bi-book-half fs-2 me-2"></i>
          <span>Mindle</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a class="nav-link" href="index.html">Home</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                Theme
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" id="light-theme">Light Theme</a></li>
                <li><a class="dropdown-item" href="#" id="dark-theme">Dark Theme</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i>
                <span id="user-name">John Doe</span>
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" id="profile-link"><i class="bi bi-person me-2"></i>Profile</a></li>
                <li><a class="dropdown-item" href="#" id="settings-link"><i class="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="logout-link"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <div class="page-header mt-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 mb-3">Study Methods</h1>
            <p class="lead mb-4">Discover effective techniques to enhance your learning experience and boost your academic performance.</p>
            <div class="d-flex flex-wrap">
              <button class="btn filter-btn active" data-filter="all">All Methods</button>
              <button class="btn filter-btn" data-filter="time-management">Time Management</button>
              <button class="btn filter-btn" data-filter="comprehension">Comprehension</button>
              <button class="btn filter-btn" data-filter="memorization">Memorization</button>
              <button class="btn filter-btn" data-filter="note-taking">Note Taking</button>
            </div>
          </div>
          <div class="col-lg-6 d-none d-lg-block">
            <img src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80" alt="Study Methods" class="img-fluid rounded-3 shadow">
          </div>
        </div>
      </div>
    </div>

    <!-- Study Methods Section -->
    <section class="container mb-5">
      <div class="row g-4" id="methods-container">
        <!-- Methods will be dynamically added here -->
      </div>
    </section>

    <!-- Method Detail Modal -->
    <div class="modal fade" id="methodModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="method-modal-title">Method Name</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-5 mb-3 mb-md-0">
                <div id="method-modal-icon" class="method-icon-large mb-3">
                  <i class="bi bi-alarm"></i>
                </div>
                <h5>Benefits:</h5>
                <ul class="benefits-list" id="method-benefits">
                  <!-- Benefits will be added dynamically -->
                </ul>
              </div>
              <div class="col-md-7">
                <p id="method-modal-description" class="mb-4">Method description goes here.</p>
                <h5>How to use this method:</h5>
                <ul class="steps-list" id="method-steps">
                  <!-- Steps will be added dynamically -->
                </ul>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" id="try-method-btn">Try This Method</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <a class="navbar-brand d-inline-flex align-items-center" href="index.html">
              <i class="bi bi-book-half fs-4 me-2"></i>
              <span>Mindle</span>
            </a>
            <p class="mt-2 mb-0">Empowering students with effective learning techniques.</p>
          </div>
          <div class="col-md-6 text-center text-md-end">
            <div class="social-links">
              <a href="#"><i class="bi bi-facebook"></i></a>
              <a href="#"><i class="bi bi-twitter"></i></a>
              <a href="#"><i class="bi bi-instagram"></i></a>
              <a href="#"><i class="bi bi-linkedin"></i></a>
            </div>
            <p class="mt-2 mb-0">&copy; 2025 Mindle. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
`;

// Function to render study methods
function renderMethods(methods) {
  const container = document.getElementById('methods-container');
  container.innerHTML = '';
  
  methods.forEach(method => {
    const methodCard = document.createElement('div');
    methodCard.className = 'col-md-6 col-lg-4';
    methodCard.innerHTML = `
      <div class="method-card" data-method="${method.name}">
        <div class="method-icon-container">
          <div class="method-icon">
            <i class="bi ${method.icon} fs-1"></i>
          </div>
        </div>
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
  
  document.getElementById('method-modal-title').textContent = method.name;
  document.getElementById('method-modal-icon').innerHTML = `<i class="bi ${method.icon}"></i>`;
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
  alert(`You've chosen to try the ${methodName}. This feature will guide you through implementing this method in your study routine.`);
  
  // Close the modal
  const methodModal = bootstrap.Modal.getInstance(document.getElementById('methodModal'));
  methodModal.hide();
});

// Theme switcher functionality
const lightThemeBtn = document.getElementById('light-theme');
const darkThemeBtn = document.getElementById('dark-theme');

if (lightThemeBtn && darkThemeBtn) {
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
}

// Initial render of study methods
renderMethods(studyMethods);