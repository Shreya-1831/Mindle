// Theme Switching Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Get theme elements
  const lightThemeBtn = document.getElementById('light-theme');
  const darkThemeBtn = document.getElementById('dark-theme');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use default
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  
  // Theme switcher functions
  lightThemeBtn.addEventListener('click', () => {
    setTheme('light');
  });
  
  darkThemeBtn.addEventListener('click', () => {
    setTheme('dark');
  });
  
  function setTheme(theme) {
    htmlElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Add animation for theme change
    document.body.classList.add('theme-transition');
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 1000);
  }
  
  // Get Started button scroll effect
  const getStartedBtn = document.getElementById('get-started');
  getStartedBtn.addEventListener('click', () => {
    document.getElementById('methods').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Smooth scrolling for all navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
  
  // Load study methods
  const studyMethods = [
    { name: "Pomodoro Technique", description: "Work in focused intervals with short breaks to enhance productivity.", img: "pomodoro.png" },
    { name: "Feynman Technique", description: "Learn by explaining concepts in simple terms to reinforce understanding.", img: "feynman.png" },
    { name: "SQ3R Method", description: "Survey, Question, Read, Recite, and Review to enhance comprehension.", img: "sq3r.png" },
    { name: "Active Recall", description: "Test yourself frequently instead of passively rereading notes.", img: "active-recall.png" },
    { name: "Mind Mapping", description: "Create visual diagrams to understand relationships between concepts.", img: "mind-mapping.png" },
    { name: "Interleaved Learning", description: "Mix multiple subjects in a study session for better retention.", img: "interleaved.png" },
    { name: "Leitner System", description: "Use flashcards and spaced repetition for efficient memorization.", img: "leitner.png" },
    { name: "Spaced Repetition", description: "Review information at increasing intervals to boost long-term retention.", img: "spaced-repetition.png" },
    { name: "Cornell Note-Taking", description: "Divide notes into key points, summaries, and details for better recall.", img: "cornell.png" },
    { name: "Metacognition", description: "Reflect on your learning process to improve study effectiveness.", img: "metacognition.png" }
  ];
  
  // Populate methods container
  const methodsContainer = document.getElementById('methods-container');
  if (methodsContainer) {
    // Get first 8 methods or all if less than 8
    const displayMethods = studyMethods.slice(0, 8);
    
    displayMethods.forEach(method => {
      const methodCol = document.createElement('div');
      methodCol.className = 'col-md-6 col-lg-3 mb-4';
      
      // Use placeholder image if method image is not available
      const imgSrc = method.img ? 
        `https://via.placeholder.com/150?text=${method.name.replace(/\s+/g, '+')}` : 
        `https://via.placeholder.com/150?text=${method.name.replace(/\s+/g, '+')}`;
      
      methodCol.innerHTML = `
        <div class="card h-100 method-card">
          <div class="card-body text-center p-4">
            <div class="method-icon mb-3">
              <i class="bi bi-lightbulb fs-1"></i>
            </div>
            <h3 class="card-title h4">${method.name}</h3>
            <p class="card-text">${method.description}</p>
          </div>
        </div>
      `;
      
      methodsContainer.appendChild(methodCol);
    });
  }
  
  // Form submission handlers
  const contactForm = document.getElementById('contact-form');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignupSubmit);
  }
  
  function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // In a real application, you would send this data to a server
    console.log('Contact form submitted:', { name, email, message });
    
    // Show success message
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    contactForm.reset();
  }
  
  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // In a real application, you would authenticate with a server
    console.log('Login attempted:', { email, password, rememberMe });
    
    // Show success message (for demo purposes)
    showNotification('Login successful!', 'success');
    
    // Close the modal
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    loginModal.hide();
    loginForm.reset();
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
  }
  
  function handleSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    
    // Check if passwords match
    if (password !== confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }
    
    // In a real application, you would register with a server
    console.log('Signup attempted:', { name, email, password });
    
    // Show success message (for demo purposes)
    showNotification('Account created successfully! You can now log in.', 'success');
    
    // Close the modal
    const signupModal = bootstrap.Modal.getInstance(document.getElementById('signupModal'));
    signupModal.hide();
    signupForm.reset();
  }

  // Custom notification function
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'}"></i>
        <p>${message}</p>
      </div>
    `;
    
    // Add to DOM
    const container = document.getElementById('notification-container');
    container.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 4000);
  }
  
  // Navbar background change on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
      navbar.style.padding = '0.5rem 1rem';
    } else {
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      navbar.style.padding = '1rem';
    }
    
    // Reveal animations on scroll
    revealElements();
  });
  
  // Reveal elements on scroll
  function revealElements() {
    const reveals = document.querySelectorAll('.reveal');
    
    reveals.forEach(element => {
      const windowHeight = window.innerHeight;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('active');
      }
    });
  }
  
  // Initialize reveal elements
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.add('reveal');
  });
  
  // Initial check for elements in view
  revealElements();
  
  // Add particle background to hero section (if dark theme)
  if (savedTheme === 'dark') {
    initParticles();
  }
  
  // Initialize particles for dark theme
  function initParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-container';
    heroSection.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
      createParticle(particleContainer);
    }
  }
  
  function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 5 + 1;
    
    // Random color (neon colors for dark theme)
    const colors = ['#00ffcc', '#ff00ff', '#00ccff', '#ffcc00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Set styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
  }
  
  // Add typing effect to hero heading
  const heroHeading = document.querySelector('.hero-section h1');
  if (heroHeading) {
    const text = heroHeading.textContent;
    heroHeading.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroHeading.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };
    
    setTimeout(typeWriter, 500);
  }
});