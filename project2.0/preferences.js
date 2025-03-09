document.addEventListener('DOMContentLoaded', () => {
  // Theme Switching Functionality
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
  
  // Range slider value display
  const totalHoursSlider = document.getElementById('total-hours');
  const hoursValueDisplay = document.getElementById('hours-value');
  
  totalHoursSlider.addEventListener('input', () => {
    hoursValueDisplay.textContent = totalHoursSlider.value;
  });
  
  // Back button functionality
  const backBtn = document.getElementById('back-btn');
  backBtn.addEventListener('click', () => {
    window.location.href = 'dashboard.html';
  });
  
  // Domain selection change handler
  const domainSelect = document.getElementById('domain');
  domainSelect.addEventListener('change', async () => {
    const selectedDomain = domainSelect.value;
    if (selectedDomain) {
      // Show loading state
      showNotification('Fetching course recommendations...', 'info');
      
      try {
        // Get course recommendations based on the selected domain
        const recommendations = await getCourseRecommendations(selectedDomain);
        
        // Store recommendations in localStorage
        localStorage.setItem('courseRecommendations', JSON.stringify(recommendations));
        
        // Show success notification
        showNotification('Course recommendations ready!', 'success');
      } catch (error) {
        console.error('Error getting course recommendations:', error);
        showNotification('Failed to get course recommendations. Please try again.', 'error');
      }
    }
  });
  
  // Form submission
  const preferencesForm = document.getElementById('preferences-form');
  preferencesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Show loading state
    const generateBtn = document.getElementById('generate-timetable-btn');
    const originalBtnText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Generating...';
    generateBtn.disabled = true;
    
    try {
      // Get form data
      const formData = getFormData();
      
      // If AI recommendations are enabled, generate mock recommendations
      if (document.getElementById('ai-recommendations').checked) {
        await generateMockRecommendations(formData);
      }
      
      // If we don't have course recommendations yet, get them now
      if (!localStorage.getItem('courseRecommendations') && formData.useAICourseSuggestions) {
        await getCourseRecommendations(formData.domain);
      }
      
      // Store preferences in localStorage for use in the timetable generation
      localStorage.setItem('studyPreferences', JSON.stringify(formData));
      
      // Redirect to course recommendation page if AI course suggestions are enabled
      if (formData.useAICourseSuggestions) {
        setTimeout(() => {
          window.location.href = 'course-recommendation.html?fromPreferences=true';
        }, 1500);
      } else {
        // Redirect to timetable page or show timetable modal
        setTimeout(() => {
          window.location.href = 'dashboard.html?showTimetable=true';
        }, 1500);
      }
      
    } catch (error) {
      console.error('Error generating timetable:', error);
      showNotification('There was an error generating your timetable. Please try again.', 'error');
      
      // Reset button state
      generateBtn.innerHTML = originalBtnText;
      generateBtn.disabled = false;
    }
  });
  
  // Validate form
  function validateForm() {
    // Check if timetable name is provided
    const timetableName = document.getElementById('timetable-name').value.trim();
    if (!timetableName) {
      showNotification('Please enter a name for your timetable', 'error');
      return false;
    }
    
    // Check if at least one day is selected
    const selectedDays = document.querySelectorAll('.days-selector input[type="checkbox"]:checked');
    if (selectedDays.length === 0) {
      showNotification('Please select at least one day for studying', 'error');
      return false;
    }
    
    // Check if at least one study method is selected
    const selectedMethods = document.querySelectorAll('.study-methods-container input[type="checkbox"]:checked');
    if (selectedMethods.length === 0) {
      showNotification('Please select at least one study method', 'error');
      return false;
    }
    
    // Check if domain is selected
    const domain = document.getElementById('domain').value;
    if (!domain) {
      showNotification('Please select a learning domain', 'error');
      return false;
    }
    
    // Check if study time preference is selected
    const studyPreference = document.getElementById('study-preferences').value;
    if (!studyPreference) {
      showNotification('Please select your study time preference', 'error');
      return false;
    }
    
    return true;
  }
  
  // Get form data
  function getFormData() {
    const timetableName = document.getElementById('timetable-name').value.trim();
    const preferredLanguage = document.getElementById('preferred-language').value;
    const domain = document.getElementById('domain').value;
    const totalHours = document.getElementById('total-hours').value;
    const studyPreference = document.getElementById('study-preferences').value;
    
    // Get selected days
    const selectedDays = [];
    document.querySelectorAll('.days-selector input[type="checkbox"]:checked').forEach(checkbox => {
      selectedDays.push(checkbox.value);
    });
    
    // Get selected study methods
    const selectedMethods = [];
    document.querySelectorAll('.study-methods-container input[type="checkbox"]:checked').forEach(checkbox => {
      selectedMethods.push(checkbox.value);
    });
    
    // AI options
    const useAIRecommendations = document.getElementById('ai-recommendations').checked;
    const useAICourseSuggestions = document.getElementById('ai-course-suggestions').checked;
    
    return {
      timetableName,
      preferredLanguage,
      domain,
      totalHours,
      studyPreference,
      selectedDays,
      selectedMethods,
      useAIRecommendations,
      useAICourseSuggestions
    };
  }
  
  // Get course recommendations using mock data
  async function getCourseRecommendations(domain) {
    try {
      console.log('Generating mock course recommendations for domain:', domain);
      
      // Format domain for better readability
      const formattedDomain = domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create mock course recommendations
      const providers = ['Coursera', 'Udemy', 'edX', 'Stanford Online', 'Harvard Online', 'Khan Academy'];
      const durations = ['4 weeks', '6 weeks', '8 weeks', '3 months', '4 months'];
      const levels = ['Beginner', 'Intermediate', 'Advanced'];
      
      const courses = [];
      
      // Generate 5-8 courses
      const courseCount = 5 + Math.floor(Math.random() * 4);
      
      for (let i = 0; i < courseCount; i++) {
        const provider = providers[Math.floor(Math.random() * providers.length)];
        const duration = durations[Math.floor(Math.random() * durations.length)];
        const level = levels[Math.floor(Math.random() * levels.length)];
        
        // Generate course name
        const prefixes = ['Introduction to', 'Fundamentals of', 'Advanced', 'Practical', 'Complete Guide to'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        const courseName = `${prefix} ${formattedDomain}`;
        
        // Generate description
        const descriptions = [
          `Learn the core concepts and principles of ${formattedDomain} with hands-on projects.`,
          `Master ${formattedDomain} through interactive lessons and real-world examples.`,
          `Comprehensive course covering all aspects of ${formattedDomain} for beginners to advanced learners.`,
          `Practical approach to ${formattedDomain} with industry-standard techniques and tools.`,
          `Develop expertise in ${formattedDomain} with expert instructors and cutting-edge curriculum.`
        ];
        
        const description = descriptions[Math.floor(Math.random() * descriptions.length)];
        
        // Generate URL
        const url = `https://www.${provider.toLowerCase().replace(/\s+/g, '')}.com/course/${domain.toLowerCase().replace(/_/g, '-')}-${i + 1}`;
        
        courses.push({
          id: `course-${i + 1}`,
          name: courseName,
          provider: provider,
          description: description,
          duration: duration,
          level: level,
          url: url
        });
      }
      
      return { courses };
      
    } catch (error) {
      console.error('Error generating mock course recommendations:', error);
      throw error;
    }
  }
  
  // Generate mock AI recommendations
  async function generateMockRecommendations(formData) {
    try {
      console.log('Generating mock AI recommendations for:', formData);
      
      // Create mock schedule based on preferences
      const schedule = [];
      const availableDays = formData.selectedDays;
      const totalHours = parseInt(formData.totalHours);
      
      // Calculate hours per day (distribute evenly)
      const hoursPerDay = Math.ceil(totalHours / availableDays.length);
      
      // Generate time slots based on study preference
      let startTime;
      switch (formData.studyPreference) {
        case 'morning':
          startTime = 8; // 8 AM
          break;
        case 'afternoon':
          startTime = 13; // 1 PM
          break;
        case 'evening':
          startTime = 18; // 6 PM
          break;
        case 'night':
          startTime = 20; // 8 PM
          break;
        default:
          startTime = 9; // Default to 9 AM
      }
      
      // Study methods
      const methods = formData.selectedMethods;
      
      // Generate schedule for each day
      availableDays.forEach(day => {
        const daySessions = [];
        let remainingHours = hoursPerDay;
        let currentTime = startTime;
        
        while (remainingHours > 0) {
          // Session duration (1-2 hours)
          const sessionDuration = Math.min(remainingHours, 1 + Math.floor(Math.random() * 2));
          
          // Format time
          const sessionStartTime = `${currentTime}:00`;
          const sessionEndTime = `${currentTime + sessionDuration}:00`;
          
          // Select random study method
          const method = methods[Math.floor(Math.random() * methods.length)];
          
          // Generate topic based on domain
          const domain = formData.domain.replace(/_/g, ' ');
          const topics = [
            `${domain} Fundamentals`,
            `${domain} Theory`,
            `${domain} Practice`,
            `${domain} Applications`,
            `${domain} Advanced Concepts`
          ];
          
          const topic = topics[Math.floor(Math.random() * topics.length)];
          
          // Add session
          daySessions.push({
            time: `${sessionStartTime}-${sessionEndTime}`,
            topic: topic,
            method: method
          });
          
          // Update remaining hours and current time
          remainingHours -= sessionDuration;
          currentTime += sessionDuration;
          
          // Add break if more sessions to come
          if (remainingHours > 0) {
            currentTime += 0.5; // 30 minute break
          }
        }
        
        // Add day to schedule
        schedule.push({
          day: day.toLowerCase(),
          sessions: daySessions
        });
      });
      
      // Generate learning tips
      const learningTips = [
        "Break your study sessions into 25-minute focused intervals with 5-minute breaks (Pomodoro Technique).",
        "Review your notes within 24 hours of learning new material to improve retention.",
        "Teach concepts to someone else to solidify your understanding.",
        "Use spaced repetition to review material at increasing intervals.",
        "Get adequate sleep to help consolidate memory and improve learning.",
        "Stay hydrated and take regular breaks to maintain focus and productivity.",
        "Create mind maps to visualize connections between concepts.",
        "Test yourself regularly instead of just re-reading material."
      ];
      
      // Randomly select 4-6 tips
      const selectedTips = [];
      const tipCount = 4 + Math.floor(Math.random() * 3);
      
      while (selectedTips.length < tipCount) {
        const randomTip = learningTips[Math.floor(Math.random() * learningTips.length)];
        if (!selectedTips.includes(randomTip)) {
          selectedTips.push(randomTip);
        }
      }
      
      // Create mock AI recommendations
      const aiRecommendations = {
        schedule: schedule,
        recommendedCourses: [], // Will be populated by getCourseRecommendations
        learningTips: selectedTips
      };
      
      // Store AI recommendations in localStorage
      localStorage.setItem('aiRecommendations', JSON.stringify(aiRecommendations));
      console.log('Mock AI recommendations generated successfully:', aiRecommendations);
      
      return aiRecommendations;
      
    } catch (error) {
      console.error('Error generating mock AI recommendations:', error);
      // Continue without AI recommendations
      return null;
    }
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
});