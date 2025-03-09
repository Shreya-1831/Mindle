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
    
    // Get DOM elements
    const courseSearchForm = document.getElementById('course-search-form');
    const loadingIndicator = document.getElementById('loading-indicator');
    const recommendationsSection = document.getElementById('recommendations-section');
    const noResultsSection = document.getElementById('no-results');
    const courseCardsContainer = document.getElementById('course-cards-container');
    const resultsCountElement = document.getElementById('results-count');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const resetSearchBtn = document.getElementById('reset-search-btn');
    const sortBySelect = document.getElementById('sort-by');
    const saveRecommendationsBtn = document.getElementById('save-recommendations');
    
    // Course detail modal elements
    const courseDetailModal = new bootstrap.Modal(document.getElementById('courseDetailModal'));
    const courseModalTitle = document.getElementById('course-modal-title');
    const courseDetailContent = document.getElementById('course-detail-content');
    const saveCourseBtn = document.getElementById('save-course-btn');
    const enrollCourseBtn = document.getElementById('enroll-course-btn');
    
    // Current state
    let currentCourses = [];
    let displayedCourses = 0;
    let currentQuery = '';
    let selectedCourseId = null;
    let selectedCoursesForTimetable = [];
    
    // Form submission handler
    courseSearchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const courseTopic = document.getElementById('course-topic').value.trim();
      const difficultyLevel = document.getElementById('difficulty-level').value;
      const courseDuration = document.getElementById('course-duration').value;
      
      // Get selected platforms
      const selectedPlatforms = [];
      document.querySelectorAll('.platform-selector input[type="checkbox"]:checked').forEach(checkbox => {
        selectedPlatforms.push(checkbox.value);
      });
      
      // Get additional preferences
      const includeFreeCourses = document.getElementById('free-courses').checked;
      const includeCertificateCourses = document.getElementById('certificate-courses').checked;
      const includeProjectBased = document.getElementById('project-based').checked;
      
      // Validate input
      if (!courseTopic) {
        showNotification('Please enter a course topic', 'error');
        return;
      }
      
      if (selectedPlatforms.length === 0) {
        showNotification('Please select at least one platform', 'error');
        return;
      }
      
      // Save current query
      currentQuery = courseTopic;
      
      // Show loading indicator
      loadingIndicator.style.display = 'block';
      recommendationsSection.style.display = 'none';
      noResultsSection.style.display = 'none';
      
      try {
        // Get course recommendations
        const recommendations = await getCourseRecommendations(
          courseTopic,
          difficultyLevel,
          courseDuration,
          selectedPlatforms,
          includeFreeCourses,
          includeCertificateCourses,
          includeProjectBased
        );
        
        // Update UI with recommendations
        displayCourseRecommendations(recommendations);
        
      } catch (error) {
        console.error('Error getting course recommendations:', error);
        showNotification('Failed to get course recommendations. Please try again.', 'error');
        loadingIndicator.style.display = 'none';
        noResultsSection.style.display = 'block';
      }
    });
    
    // Reset search button handler
    resetSearchBtn.addEventListener('click', () => {
      courseSearchForm.reset();
      noResultsSection.style.display = 'none';
      recommendationsSection.style.display = 'none';
      
      // Check all platform checkboxes
      document.querySelectorAll('.platform-selector input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
      });
      
      // Focus on course topic input
      document.getElementById('course-topic').focus();
    });
    
    // Sort by select handler
    sortBySelect.addEventListener('change', () => {
      sortCourses(sortBySelect.value);
    });
    
    // Load more button handler
    loadMoreBtn.addEventListener('click', () => {
      loadMoreCourses();
    });
    
    // Save all recommendations button handler
    saveRecommendationsBtn.addEventListener('click', () => {
      saveAllCourses();
    });
    
    // Get course recommendations using mock data for now
    async function getCourseRecommendations(
      topic,
      difficulty = 'any',
      duration = 'any',
      platforms = ['coursera', 'udemy', 'edx', 'stanford', 'harvard', 'kaggle'],
      includeFree = true,
      includeCertificate = true,
      includeProjectBased = true
    ) {
      try {
        // For now, we'll use mock data instead of the API
        console.log('Generating mock recommendations for:', topic);
        console.log('Filters:', { difficulty, duration, platforms, includeFree, includeCertificate, includeProjectBased });
        
        // Create mock data based on the topic
        const mockCourses = generateMockCourses(topic, platforms, difficulty);
        
        return { courses: mockCourses };
        
      } catch (error) {
        console.error('Error generating course recommendations:', error);
        throw error;
      }
    }
    
    // Generate mock courses based on the topic
    function generateMockCourses(topic, platforms, difficulty) {
      const courses = [];
      const count = 8 + Math.floor(Math.random() * 5); // 8-12 courses
      
      const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];
      const durations = ['4 weeks', '6 weeks', '8 weeks', '10 weeks', '12 weeks', '3 months', '4 months'];
      const prices = ['Free', '$49.99', '$59.99', '$79.99', '$99.99', '$129.99'];
      
      // Common topics based on the main topic
      const topicWords = topic.toLowerCase().split(/\s+/);
      const relatedTopics = [];
      
      // Add some general related topics
      relatedTopics.push('Fundamentals', 'Introduction', 'Advanced Concepts', 'Practical Applications');
      
      // Add topic-specific related topics
      if (topicWords.includes('programming') || topicWords.includes('development') || topicWords.includes('coding')) {
        relatedTopics.push('Algorithms', 'Data Structures', 'Software Design', 'Testing', 'Debugging');
      } else if (topicWords.includes('data') || topicWords.includes('analytics') || topicWords.includes('science')) {
        relatedTopics.push('Statistics', 'Machine Learning', 'Data Visualization', 'Big Data', 'Predictive Modeling');
      } else if (topicWords.includes('business') || topicWords.includes('management') || topicWords.includes('marketing')) {
        relatedTopics.push('Strategy', 'Leadership', 'Finance', 'Operations', 'Market Analysis');
      } else if (topicWords.includes('design') || topicWords.includes('art') || topicWords.includes('creative')) {
        relatedTopics.push('UI/UX', 'Color Theory', 'Typography', 'Layout Design', 'Digital Illustration');
      } else {
        // Generic topics for anything else
        relatedTopics.push('Theory', 'Practice', 'Case Studies', 'Research Methods', 'Current Trends');
      }
      
      // Generate the courses
      for (let i = 0; i < count; i++) {
        // Select a random platform from the available ones
        const provider = platforms[Math.floor(Math.random() * platforms.length)].charAt(0).toUpperCase() + 
                        platforms[Math.floor(Math.random() * platforms.length)].slice(1);
        
        // Select difficulty level based on the filter or random if 'any'
        const level = difficulty !== 'any' ? 
                      difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 
                      difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)];
        
        // Generate random course topics (2-4)
        const courseTopics = [];
        const topicCount = 2 + Math.floor(Math.random() * 3);
        for (let j = 0; j < topicCount; j++) {
          const randomTopic = relatedTopics[Math.floor(Math.random() * relatedTopics.length)];
          if (!courseTopics.includes(randomTopic)) {
            courseTopics.push(randomTopic);
          }
        }
        
        // Generate a course name
        const courseNamePrefixes = ['Complete', 'Comprehensive', 'Essential', 'Professional', 'Practical', 'Modern', 'Advanced'];
        const courseNameSuffixes = ['Guide', 'Masterclass', 'Bootcamp', 'Course', 'Certification', 'Training', 'Workshop'];
        const courseNamePrefix = courseNamePrefixes[Math.floor(Math.random() * courseNamePrefixes.length)];
        const courseNameSuffix = courseNameSuffixes[Math.floor(Math.random() * courseNameSuffixes.length)];
        
        const courseName = `${courseNamePrefix} ${topic} ${courseNameSuffix}`;
        
        // Generate a course description
        const descriptionPrefixes = [
          'Learn the fundamentals of',
          'Master the art of',
          'Dive deep into',
          'Explore the world of',
          'Gain practical skills in',
          'Become proficient in',
          'Develop expertise in'
        ];
        
        const descriptionSuffixes = [
          'with hands-on projects and real-world examples.',
          'through interactive lessons and practical exercises.',
          'with industry experts and comprehensive curriculum.',
          'using the latest tools and techniques.',
          'and build a professional portfolio.',
          'to advance your career or personal projects.',
          'with step-by-step guidance and mentorship.'
        ];
        
        const descriptionPrefix = descriptionPrefixes[Math.floor(Math.random() * descriptionPrefixes.length)];
        const descriptionSuffix = descriptionSuffixes[Math.floor(Math.random() * descriptionSuffixes.length)];
        
        const description = `${descriptionPrefix} ${topic} ${descriptionSuffix}`;
        
        // Generate instructor information
        const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jennifer', 'Robert', 'Lisa', 'Daniel', 'Maria'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson'];
        const credentials = [
          'PhD in Computer Science',
          'Senior Software Engineer',
          'Data Scientist with 10+ years of experience',
          'Professor of Mathematics',
          'Industry Expert and Consultant',
          'Research Scientist',
          'Certified Instructor',
          'Author and Educator',
          'Tech Lead at a Fortune 500 company',
          'Entrepreneur and Mentor'
        ];
        
        const instructorFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const instructorLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const instructorCredential = credentials[Math.floor(Math.random() * credentials.length)];
        
        // Create the course object
        const course = {
          id: `course-${i + 1}`,
          name: courseName,
          provider: provider,
          description: description,
          duration: durations[Math.floor(Math.random() * durations.length)],
          level: level,
          price: prices[Math.floor(Math.random() * prices.length)],
          certificate: Math.random() > 0.3, // 70% chance of having a certificate
          topics: courseTopics,
          instructor: {
            name: `${instructorFirstName} ${instructorLastName}`,
            credentials: instructorCredential
          },
          url: `https://www.${provider.toLowerCase()}.com/course/${topic.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`
        };
        
        courses.push(course);
      }
      
      return courses;
    }
    
    // Display course recommendations
    function displayCourseRecommendations(recommendations) {
      // Hide loading indicator
      loadingIndicator.style.display = 'none';
      
      // Clear previous results
      courseCardsContainer.innerHTML = '';
      displayedCourses = 0;
      
      // Check if we have courses
      if (!recommendations.courses || recommendations.courses.length === 0) {
        noResultsSection.style.display = 'block';
        return;
      }
      
      // Store current courses
      currentCourses = recommendations.courses;
      
      // Update results count
      resultsCountElement.textContent = currentCourses.length;
      
      // Show recommendations section
      recommendationsSection.style.display = 'block';
      
      // Reset selected courses for timetable
      selectedCoursesForTimetable = [];
      
      // Display first batch of courses
      loadMoreCourses();
      
      // Add "Generate Timetable" button if it doesn't exist
      if (!document.getElementById('generate-timetable-btn')) {
        const timetableBtn = document.createElement('button');
        timetableBtn.id = 'generate-timetable-btn';
        timetableBtn.className = 'btn btn-success mt-3 ms-3';
        timetableBtn.innerHTML = '<i class="bi bi-calendar-check me-2"></i>Generate Timetable (0/3)';
        timetableBtn.disabled = true;
        
        // Add event listener
        timetableBtn.addEventListener('click', () => {
          generateTimetableFromSelected();
        });
        
        // Add to DOM
        document.querySelector('.text-center.mt-5').appendChild(timetableBtn);
      } else {
        // Update button text
        updateTimetableButtonText();
      }
    }
    
    // Load more courses
    function loadMoreCourses() {
      const coursesToShow = 6; // Number of courses to show per batch
      const remainingCourses = currentCourses.length - displayedCourses;
      const coursesToLoad = Math.min(coursesToShow, remainingCourses);
      
      if (coursesToLoad <= 0) {
        loadMoreBtn.style.display = 'none';
        return;
      }
      
      // Get the next batch of courses
      const nextBatch = currentCourses.slice(displayedCourses, displayedCourses + coursesToLoad);
      
      // Create and append course cards
      nextBatch.forEach(course => {
        const courseCard = createCourseCard(course);
        courseCardsContainer.appendChild(courseCard);
      });
      
      // Update displayed courses count
      displayedCourses += coursesToLoad;
      
      // Hide load more button if no more courses
      if (displayedCourses >= currentCourses.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
    
    // Create course card
    function createCourseCard(course) {
      const cardCol = document.createElement('div');
      cardCol.className = 'col-md-6 col-lg-4';
      
      // Format price
      const priceDisplay = course.price === 'Free' ? 
        '<span class="course-price free">Free</span>' : 
        `<span class="course-price">${course.price}</span>`;
      
      // Check if course is selected for timetable
      const isSelected = selectedCoursesForTimetable.some(c => c.id === course.id);
      const selectBtnClass = isSelected ? 'btn-success' : 'btn-outline-success';
      const selectBtnText = isSelected ? 'Selected' : 'Select';
      
      // Create card HTML
      cardCol.innerHTML = `
        <div class="course-card" data-course-id="${course.id}">
          <div class="course-content">
            <div class="course-provider-badge mb-2">${course.provider}</div>
            <h3 class="course-title">${course.name}</h3>
            <div class="course-info">
              <div class="course-rating">
                <i class="bi bi-star-fill"></i>
                <span>${(4 + Math.random()).toFixed(1)}</span>
              </div>
              <div class="course-duration">
                <i class="bi bi-clock"></i>
                <span>${course.duration}</span>
              </div>
            </div>
            <p class="course-description">${course.description}</p>
            <div class="course-tags">
              <span class="course-tag">${course.level}</span>
              ${course.certificate ? '<span class="course-tag">Certificate</span>' : ''}
              ${course.topics.slice(0, 2).map(topic => `<span class="course-tag">${topic}</span>`).join('')}
            </div>
            <div class="course-actions">
              ${priceDisplay}
              <div>
                <button class="btn btn-sm ${selectBtnClass} select-course-btn me-2" data-course-id="${course.id}">
                  <i class="bi ${isSelected ? 'bi-check-circle' : 'bi-plus-circle'} me-1"></i>${selectBtnText}
                </button>
                <button class="btn btn-sm btn-primary view-details-btn">View Details</button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Add event listener to view details button
      cardCol.querySelector('.view-details-btn').addEventListener('click', () => {
        showCourseDetails(course);
      });
      
      // Add event listener to select course button
      cardCol.querySelector('.select-course-btn').addEventListener('click', (e) => {
        toggleCourseSelection(course, e.target);
      });
      
      return cardCol;
    }
    
    // Toggle course selection for timetable
    function toggleCourseSelection(course, buttonElement) {
      // Check if course is already selected
      const courseIndex = selectedCoursesForTimetable.findIndex(c => c.id === course.id);
      
      if (courseIndex === -1) {
        // Check if we already have 3 courses selected
        if (selectedCoursesForTimetable.length >= 3) {
          showNotification('You can only select up to 3 courses for the timetable', 'error');
          return;
        }
        
        // Add course to selected courses
        selectedCoursesForTimetable.push(course);
        
        // Update button
        buttonElement.classList.remove('btn-outline-success');
        buttonElement.classList.add('btn-success');
        buttonElement.innerHTML = '<i class="bi bi-check-circle me-1"></i>Selected';
      } else {
        // Remove course from selected courses
        selectedCoursesForTimetable.splice(courseIndex, 1);
        
        // Update button
        buttonElement.classList.remove('btn-success');
        buttonElement.classList.add('btn-outline-success');
        buttonElement.innerHTML = '<i class="bi bi-plus-circle me-1"></i>Select';
      }
      
      // Update timetable button
      updateTimetableButtonText();
    }
    
    // Update timetable button text
    function updateTimetableButtonText() {
      const timetableBtn = document.getElementById('generate-timetable-btn');
      if (timetableBtn) {
        timetableBtn.innerHTML = `<i class="bi bi-calendar-check me-2"></i>Generate Timetable (${selectedCoursesForTimetable.length}/3)`;
        timetableBtn.disabled = selectedCoursesForTimetable.length === 0;
      }
    }
    
    // Generate timetable from selected courses
    function generateTimetableFromSelected() {
      if (selectedCoursesForTimetable.length === 0) {
        showNotification('Please select at least one course for the timetable', 'error');
        return;
      }
      
      // Store selected courses in localStorage
      localStorage.setItem('selectedCoursesForTimetable', JSON.stringify(selectedCoursesForTimetable));
      
      // Show notification
      showNotification(`Preparing timetable for ${selectedCoursesForTimetable.length} selected courses...`, 'info');
      
      // Check if we have study preferences
      const preferences = JSON.parse(localStorage.getItem('studyPreferences'));
      
      if (!preferences) {
        // Redirect to preferences page if no preferences are set
        setTimeout(() => {
          window.location.href = 'preferences.html';
        }, 1500);
      } else {
        // Redirect to timetable page
        setTimeout(() => {
          window.location.href = 'timetable.html';
        }, 1500);
      }
    }
    
    // Show course details in modal
    function showCourseDetails(course) {
      // Set selected course ID
      selectedCourseId = course.id;
      
      // Update modal title
      courseModalTitle.textContent = course.name;
      
      // Format price
      const priceDisplay = course.price === 'Free' ? 
        '<span class="text-success fw-bold">Free</span>' : 
        `<span class="fw-bold">${course.price}</span>`;
      
      // Check if course is selected for timetable
      const isSelected = selectedCoursesForTimetable.some(c => c.id === course.id);
      const selectBtnClass = isSelected ? 'btn-success' : 'btn-outline-success';
      const selectBtnText = isSelected ? 'Selected for Timetable' : 'Select for Timetable';
      
      // Create course detail HTML
      courseDetailContent.innerHTML = `
        <div class="course-detail-header">
          <div class="course-detail-info">
            <h3>${course.name}</h3>
            <div class="course-detail-meta">
              <div class="course-detail-meta-item">
                <i class="bi bi-building"></i>
                <span>${course.provider}</span>
              </div>
              <div class="course-detail-meta-item">
                <i class="bi bi-clock"></i>
                <span>${course.duration}</span>
              </div>
              <div class="course-detail-meta-item">
                <i class="bi bi-bar-chart"></i>
                <span>${course.level}</span>
              </div>
              <div class="course-detail-meta-item">
                <i class="bi bi-cash"></i>
                <span>${priceDisplay}</span>
              </div>
              <div class="course-detail-meta-item">
                <i class="bi bi-award"></i>
                <span>${course.certificate ? 'Certificate Included' : 'No Certificate'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="course-detail-description">
          <p>${course.description}</p>
        </div>
        
        <div class="course-detail-section">
          <h4>What You'll Learn</h4>
          <ul class="course-syllabus">
            ${course.topics.map(topic => `
              <li><i class="bi bi-check-circle"></i> ${topic}</li>
            `).join('')}
          </ul>
        </div>
        
        <div class="course-detail-section">
          <h4>Instructor</h4>
          <div class="instructor-info">
            <div class="instructor-details">
              <h5>${course.instructor.name}</h5>
              <p>${course.instructor.credentials}</p>
            </div>
          </div>
        </div>
        
        <div class="course-detail-section mt-4">
          <button class="btn ${selectBtnClass} w-100" id="select-for-timetable-btn">
            <i class="bi ${isSelected ? 'bi-check-circle' : 'bi-plus-circle'} me-2"></i>${selectBtnText}
          </button>
        </div>
      `;
      
      // Update enroll button URL
      enrollCourseBtn.href = course.url;
      
      // Add event listener to select for timetable button
      document.getElementById('select-for-timetable-btn').addEventListener('click', () => {
        // Find the course card button and click it to toggle selection
        const courseCardBtn = document.querySelector(`.select-course-btn[data-course-id="${course.id}"]`);
        if (courseCardBtn) {
          courseCardBtn.click();
          
          // Update modal button
          const modalBtn = document.getElementById('select-for-timetable-btn');
          const isNowSelected = selectedCoursesForTimetable.some(c => c.id === course.id);
          
          if (isNowSelected) {
            modalBtn.classList.remove('btn-outline-success');
            modalBtn.classList.add('btn-success');
            modalBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Selected for Timetable';
          } else {
            modalBtn.classList.remove('btn-success');
            modalBtn.classList.add('btn-outline-success');
            modalBtn.innerHTML = '<i class="bi bi-plus-circle me-2"></i>Select for Timetable';
          }
        }
      });
      
      // Show modal
      courseDetailModal.show();
    }
    
    // Sort courses
    function sortCourses(sortBy) {
      if (currentCourses.length === 0) return;
      
      switch (sortBy) {
        case 'relevance':
          // No sorting needed, already in relevance order
          break;
        case 'rating':
          // Sort by random rating (since we generate random ratings)
          currentCourses.sort(() => Math.random() - 0.5);
          break;
        case 'newest':
          // Shuffle to simulate newest sorting
          currentCourses.sort(() => Math.random() - 0.5);
          break;
      }
      
      // Reset display
      courseCardsContainer.innerHTML = '';
      displayedCourses = 0;
      loadMoreCourses();
    }
    
    // Save all courses
    function saveAllCourses() {
      // Get saved courses from localStorage
      const savedCourses = JSON.parse(localStorage.getItem('savedCourses')) || [];
      
      // Add current courses to saved courses
      const updatedSavedCourses = [...savedCourses];
      
      let newCoursesCount = 0;
      
      currentCourses.forEach(course => {
        // Check if course is already saved
        const isAlreadySaved = savedCourses.some(savedCourse => savedCourse.id === course.id);
        
        if (!isAlreadySaved) {
          updatedSavedCourses.push(course);
          newCoursesCount++;
        }
      });
      
      // Save to localStorage
      localStorage.setItem('savedCourses', JSON.stringify(updatedSavedCourses));
      
      // Show notification
      if (newCoursesCount > 0) {
        showNotification(`Saved ${newCoursesCount} new courses to your collection`, 'success');
      } else {
        showNotification('All courses are already in your collection', 'info');
      }
    }
    
    // Save individual course
    saveCourseBtn.addEventListener('click', () => {
      if (!selectedCourseId) return;
      
      // Find selected course
      const selectedCourse = currentCourses.find(course => course.id === selectedCourseId);
      if (!selectedCourse) return;
      
      // Get saved courses from localStorage
      const savedCourses = JSON.parse(localStorage.getItem('savedCourses')) || [];
      
      // Check if course is already saved
      const isAlreadySaved = savedCourses.some(course => course.id === selectedCourseId);
      
      if (isAlreadySaved) {
        showNotification('This course is already in your collection', 'info');
        return;
      }
      
      // Add course to saved courses
      savedCourses.push(selectedCourse);
      
      // Save to localStorage
      localStorage.setItem('savedCourses', JSON.stringify(savedCourses));
      
      // Show notification
      showNotification('Course saved to your collection', 'success');
      
      // Update button text
      saveCourseBtn.innerHTML = '<i class="bi bi-bookmark-check-fill me-2"></i>Saved';
      saveCourseBtn.disabled = true;
    });
    
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
    
    // Check if we came from preferences page
    const urlParams = new URLSearchParams(window.location.search);
    const fromPreferences = urlParams.get('fromPreferences');
    
    if (fromPreferences === 'true') {
      // Get preferences from localStorage
      const preferences = JSON.parse(localStorage.getItem('studyPreferences')) || {};
      
      if (preferences.domain) {
        // Pre-fill the course topic based on domain
        const domainMap = {
          'computer_science': 'Computer Science fundamentals',
          'data_science': 'Data Science and Analytics',
          'web_development': 'Web Development',
          'mobile_development': 'Mobile App Development',
          'artificial_intelligence': 'Artificial Intelligence and Machine Learning',
          'mathematics': 'Mathematics',
          'physics': 'Physics',
          'chemistry': 'Chemistry',
          'biology': 'Biology',
          'business': 'Business and Management',
          'languages': 'Language Learning',
          'arts': 'Arts and Design',
          'music': 'Music Theory and Practice',
          'health': 'Health and Medicine'
        };
        
        const topicInput = document.getElementById('course-topic');
        topicInput.value = domainMap[preferences.domain] || preferences.domain.replace('_', ' ');
        
        // Auto-submit the form
        setTimeout(() => {
          document.getElementById('find-courses-btn').click();
        }, 500);
      }
    }
  });