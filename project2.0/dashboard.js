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
  
  // Set user name in navbar and sidebar
  const userNameElements = document.querySelectorAll('#user-name, #sidebar-user-name, #header-user-name');
  const userName = localStorage.getItem('userName') || 'John Doe';
  userNameElements.forEach(element => {
    if (element.id === 'header-user-name') {
      element.textContent = userName.split(' ')[0]; // First name only for header
    } else {
      element.textContent = userName;
    }
  });
  
  // Initialize charts
  initializeCharts();
  
  // Handle New Timetable button click
  const newTimetableBtn = document.getElementById('new-timetable-btn');
  if (newTimetableBtn) {
    newTimetableBtn.addEventListener('click', () => {
      const newTimetableModal = new bootstrap.Modal(document.getElementById('newTimetableModal'));
      newTimetableModal.show();
    });
  }
  
  // Handle Find Courses button click
  const findCoursesBtn = document.getElementById('find-courses-btn');
  if (findCoursesBtn) {
    findCoursesBtn.addEventListener('click', async () => {
      // Validate form
      const domain = document.getElementById('domain').value;
      if (!domain) {
        showNotification('Please select a learning domain first', 'error');
        return;
      }
      
      // Show loading state
      findCoursesBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Finding Courses...';
      findCoursesBtn.disabled = true;
      
      try {
        // Get course recommendations
        const recommendations = await getCourseRecommendations(domain);
        
        // Populate the recommendations modal
        populateCourseRecommendations(recommendations);
        
        // Hide the timetable modal and show the recommendations modal
        const newTimetableModal = bootstrap.Modal.getInstance(document.getElementById('newTimetableModal'));
        newTimetableModal.hide();
        
        setTimeout(() => {
          const courseRecommendationsModal = new bootstrap.Modal(document.getElementById('courseRecommendationsModal'));
          courseRecommendationsModal.show();
          
          // Reset button state
          findCoursesBtn.innerHTML = 'Find Courses';
          findCoursesBtn.disabled = false;
        }, 500);
        
      } catch (error) {
        console.error('Error getting course recommendations:', error);
        showNotification('Failed to get course recommendations. Please try again.', 'error');
        
        // Reset button state
        findCoursesBtn.innerHTML = 'Find Courses';
        findCoursesBtn.disabled = false;
      }
    });
  }
  
  // Handle Select Courses button click
  const selectCoursesBtn = document.getElementById('select-courses-btn');
  if (selectCoursesBtn) {
    selectCoursesBtn.addEventListener('click', () => {
      // Get selected courses
      const selectedCourses = [];
      document.querySelectorAll('.course-checkbox:checked').forEach(checkbox => {
        const courseId = checkbox.getAttribute('data-course-id');
        const courseName = checkbox.getAttribute('data-course-name');
        const courseProvider = checkbox.getAttribute('data-course-provider');
        
        selectedCourses.push({
          id: courseId,
          name: courseName,
          provider: courseProvider
        });
      });
      
      // Store selected courses in localStorage
      localStorage.setItem('selectedCourses', JSON.stringify(selectedCourses));
      
      // Enable the Create Timetable button
      document.getElementById('create-timetable-btn').disabled = false;
      
      // Hide the recommendations modal and show the timetable modal
      const courseRecommendationsModal = bootstrap.Modal.getInstance(document.getElementById('courseRecommendationsModal'));
      courseRecommendationsModal.hide();
      
      setTimeout(() => {
        const newTimetableModal = new bootstrap.Modal(document.getElementById('newTimetableModal'));
        newTimetableModal.show();
        
        // Show notification
        showNotification(`${selectedCourses.length} courses selected`, 'success');
      }, 500);
    });
  }
  
  // Handle Create Timetable button click
  const createTimetableBtn = document.getElementById('create-timetable-btn');
  if (createTimetableBtn) {
    createTimetableBtn.addEventListener('click', () => {
      // Get form data
      const timetableName = document.getElementById('timetable-name').value;
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      
      // Validate form
      if (!timetableName || !startDate || !endDate) {
        showNotification('Please fill in all required fields', 'error');
        return;
      }
      
      // Get selected days
      const selectedDays = [];
      document.querySelectorAll('input[type="checkbox"][id^="day"]:checked').forEach(checkbox => {
        selectedDays.push(checkbox.value);
      });
      
      if (selectedDays.length === 0) {
        showNotification('Please select at least one day of the week', 'error');
        return;
      }
      
      // Get selected courses
      const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses') || '[]');
      
      if (selectedCourses.length === 0) {
        showNotification('Please select at least one course', 'error');
        return;
      }
      
      // Store timetable data
      const timetableData = {
        name: timetableName,
        startDate,
        endDate,
        selectedDays,
        selectedCourses
      };
      
      localStorage.setItem('timetableData', JSON.stringify(timetableData));
      
      // Generate timetable
      generateTimetable(timetableData);
      
      // Hide the new timetable modal and show the generated timetable modal
      const newTimetableModal = bootstrap.Modal.getInstance(document.getElementById('newTimetableModal'));
      newTimetableModal.hide();
      
      setTimeout(() => {
        const generatedTimetableModal = new bootstrap.Modal(document.getElementById('generatedTimetableModal'));
        generatedTimetableModal.show();
        
        // Set timetable title
        document.getElementById('timetable-title').textContent = timetableName;
      }, 500);
    });
  }
  
  // Handle Save Timetable button click
  const saveTimetableBtn = document.getElementById('save-timetable-btn');
  if (saveTimetableBtn) {
    saveTimetableBtn.addEventListener('click', () => {
      // Save timetable
      const timetableData = JSON.parse(localStorage.getItem('timetableData') || '{}');
      
      // In a real application, you would save this to a database
      console.log('Saving timetable:', timetableData);
      
      // Show success message
      showNotification('Timetable saved successfully!', 'success');
      
      // Close the modal
      const generatedTimetableModal = bootstrap.Modal.getInstance(document.getElementById('generatedTimetableModal'));
      generatedTimetableModal.hide();
    });
  }
  
  // Check if we should show the timetable modal (coming from preferences page)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('showTimetable') === 'true') {
    // Get preferences and course recommendations
    const preferences = JSON.parse(localStorage.getItem('studyPreferences') || '{}');
    const courseRecommendations = JSON.parse(localStorage.getItem('courseRecommendations') || '{"courses":[]}');
    
    // Set timetable name
    if (preferences.timetableName) {
      document.getElementById('timetable-name').value = preferences.timetableName;
    }
    
    // Set default dates (current date to 4 months later)
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(today.getMonth() + 4);
    
    document.getElementById('start-date').value = formatDate(today);
    document.getElementById('end-date').value = formatDate(endDate);
    
    // Check days based on preferences
    if (preferences.selectedDays && preferences.selectedDays.length > 0) {
      preferences.selectedDays.forEach(day => {
        const checkbox = document.getElementById(day);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }
    
    // Show the find courses button
    setTimeout(() => {
      // If we have course recommendations, show them directly
      if (courseRecommendations.courses && courseRecommendations.courses.length > 0) {
        populateCourseRecommendations(courseRecommendations);
        
        const courseRecommendationsModal = new bootstrap.Modal(document.getElementById('courseRecommendationsModal'));
        courseRecommendationsModal.show();
      } else {
        // Otherwise show the new timetable modal
        const newTimetableModal = new bootstrap.Modal(document.getElementById('newTimetableModal'));
        newTimetableModal.show();
      }
    }, 1000);
  }
  
  // Helper function to format date as YYYY-MM-DD
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Populate course recommendations
  function populateCourseRecommendations(recommendations) {
    const container = document.getElementById('recommended-courses-container');
    container.innerHTML = '';
    
    if (!recommendations.courses || recommendations.courses.length === 0) {
      container.innerHTML = '<div class="col-12"><div class="alert alert-info">No course recommendations available. Please try a different domain.</div></div>';
      return;
    }
    
    recommendations.courses.forEach((course, index) => {
      const courseCard = document.createElement('div');
      courseCard.className = 'col-md-6';
      courseCard.innerHTML = `
        <div class="card mb-3">
          <div class="card-body">
            <div class="d-flex align-items-start">
              <div class="form-check me-3">
                <input class="form-check-input course-checkbox" type="checkbox" id="course-${index}" 
                  data-course-id="${index}" 
                  data-course-name="${course.name}" 
                  data-course-provider="${course.provider}">
              </div>
              <div>
                <h5 class="card-title">${course.name}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${course.provider} | ${course.duration} | ${course.level}</h6>
                <p class="card-text">${course.description}</p>
                <a href="${course.url}" target="_blank" class="card-link">View Course</a>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(courseCard);
    });
  }
  
  // Generate timetable
  function generateTimetable(timetableData) {
    const timetableBody = document.getElementById('timetable-body');
    timetableBody.innerHTML = '';
    
    // Define time slots
    const timeSlots = [
      '8:00 - 9:00',
      '9:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '12:00 - 13:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
      '19:00 - 20:00'
    ];
    
    // Define days
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    // Get selected days
    const selectedDays = timetableData.selectedDays;
    
    // Get selected courses
    const selectedCourses = timetableData.selectedCourses;
    
    // Create timetable rows
    timeSlots.forEach(timeSlot => {
      const row = document.createElement('tr');
      
      // Add time cell
      const timeCell = document.createElement('td');
      timeCell.className = 'time-cell';
      timeCell.textContent = timeSlot;
      row.appendChild(timeCell);
      
      // Add day cells
      days.forEach(day => {
        const dayCell = document.createElement('td');
        dayCell.className = selectedDays.includes(day) ? 'day-cell' : 'day-cell unavailable';
        
        // Randomly assign courses to time slots (in a real app, this would be more sophisticated)
        if (selectedDays.includes(day) && Math.random() > 0.7 && selectedCourses.length > 0) {
          const randomCourse = selectedCourses[Math.floor(Math.random() * selectedCourses.length)];
          const randomMethod = ['Pomodoro Technique', 'Active Recall', 'Feynman Technique', 'Mind Mapping'][Math.floor(Math.random() * 4)];
          
          dayCell.className += ' has-session';
          dayCell.innerHTML = `
            <div class="session-item">
              <div class="session-course">${randomCourse.name}</div>
              <div class="session-method">${randomMethod}</div>
            </div>
          `;
          
          // Add click event to show study method modal
          dayCell.addEventListener('click', () => {
            showStudyMethodModal(randomCourse.name, randomMethod);
          });
        }
        
        row.appendChild(dayCell);
      });
      
      timetableBody.appendChild(row);
    });
  }
  
  // Show study method modal
  function showStudyMethodModal(courseName, methodName) {
    const modal = new bootstrap.Modal(document.getElementById('studyMethodModal'));
    const modalTitle = document.getElementById('study-method-title');
    const modalContent = document.getElementById('study-method-content');
    
    modalTitle.textContent = `${courseName} - ${methodName}`;
    
    // Set content based on method
    let content = '';
    
    switch (methodName) {
      case 'Pomodoro Technique':
        content = `
          <div class="alert alert-info mb-4">
            <h5 class="alert-heading">Pomodoro Technique</h5>
            <p>Work in focused intervals (25 minutes) followed by short breaks (5 minutes). After 4 pomodoros, take a longer break (15-30 minutes).</p>
          </div>
          <div class="mb-4">
            <h5>Session Details</h5>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Focus:</strong> Deep work on course materials</p>
          </div>
        `;
        
        // Show the pomodoro timer
        setTimeout(() => {
          document.getElementById('pomodoro-container').style.display = 'block';
          document.getElementById('active-recall-container').style.display = 'none';
          document.getElementById('feynman-container').style.display = 'none';
        }, 100);
        break;
        
      case 'Active Recall':
        content = `
          <div class="alert alert-info mb-4">
            <h5 class="alert-heading">Active Recall</h5>
            <p>Test yourself on the material instead of passively reviewing it. Create questions and try to answer them without looking at your notes.</p>
          </div>
          <div class="mb-4">
            <h5>Session Details</h5>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Focus:</strong> Creating and answering questions about key concepts</p>
          </div>
        `;
        
        // Show the active recall container
        setTimeout(() => {
          document.getElementById('pomodoro-container').style.display = 'none';
          document.getElementById('active-recall-container').style.display = 'block';
          document.getElementById('feynman-container').style.display = 'none';
        }, 100);
        break;
        
      case 'Feynman Technique':
        content = `
          <div class="alert alert-info mb-4">
            <h5 class="alert-heading">Feynman Technique</h5>
            <p>Explain the concept in simple terms as if teaching it to someone else. Identify gaps in your understanding and review those areas.</p>
          </div>
          <div class="mb-4">
            <h5>Session Details</h5>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Focus:</strong> Explaining key concepts in simple terms</p>
          </div>
        `;
        
        // Show the feynman container
        setTimeout(() => {
          document.getElementById('pomodoro-container').style.display = 'none';
          document.getElementById('active-recall-container').style.display = 'none';
          document.getElementById('feynman-container').style.display = 'block';
        }, 100);
        break;
        
      case 'Mind Mapping':
        content = `
          <div class="alert alert-info mb-4">
            <h5 class="alert-heading">Mind Mapping</h5>
            <p>Create visual diagrams that connect ideas and concepts. Start with a central idea and branch out with related concepts.</p>
          </div>
          <div class="mb-4">
            <h5>Session Details</h5>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Focus:</strong> Creating visual connections between concepts</p>
          </div>
          <div class="text-center">
            <button class="btn btn-outline-primary">Open Mind Mapping Tool</button>
          </div>
        `;
        
        // Hide all special containers
        setTimeout(() => {
          document.getElementById('pomodoro-container').style.display = 'none';
          document.getElementById('active-recall-container').style.display = 'none';
          document.getElementById('feynman-container').style.display = 'none';
        }, 100);
        break;
        
      default:
        content = `
          <div class="alert alert-info mb-4">
            <h5 class="alert-heading">${methodName}</h5>
            <p>A structured approach to learning that helps you understand and retain information more effectively.</p>
          </div>
          <div class="mb-4">
            <h5>Session Details</h5>
            <p><strong>Course:</strong> ${courseName}</p>
            <p><strong>Focus:</strong> Applying the method to course materials</p>
          </div>
        `;
        
        // Hide all special containers
        setTimeout(() => {
          document.getElementById('pomodoro-container').style.display = 'none';
          document.getElementById('active-recall-container').style.display = 'none';
          document.getElementById('feynman-container').style.display = 'none';
        }, 100);
    }
    
    modalContent.innerHTML = content;
    modal.show();
    
    // Initialize pomodoro timer if shown
    if (methodName === 'Pomodoro Technique') {
      initializePomodoroTimer();
    }
  }
  
  // Initialize pomodoro timer
  function initializePomodoroTimer() {
    let minutes = 25;
    let seconds = 0;
    let isRunning = false;
    let timerInterval;
    let isWorkTime = true;
    
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    const timerStatus = document.getElementById('timer-status');
    const timerProgress = document.getElementById('timer-progress');
    
    // Update display
    function updateDisplay() {
      minutesDisplay.textContent = String(minutes).padStart(2, '0');
      secondsDisplay.textContent = String(seconds).padStart(2, '0');
      
      // Update progress bar
      const totalSeconds = isWorkTime ? 25 * 60 : 5 * 60;
      const currentSeconds = minutes * 60 + seconds;
      const progressPercentage = 100 - (currentSeconds / totalSeconds * 100);
      timerProgress.style.width = `${progressPercentage}%`;
    }
    
    // Start timer
    startBtn.addEventListener('click', () => {
      if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
          if (seconds === 0) {
            if (minutes === 0) {
              // Timer finished
              clearInterval(timerInterval);
              isRunning = false;
              
              // Switch between work and break
              if (isWorkTime) {
                // Switch to break time
                isWorkTime = false;
                minutes = 5;
                seconds = 0;
                timerStatus.textContent = 'Break Time';
                timerProgress.classList.remove('bg-primary');
                timerProgress.classList.add('bg-success');
                
                // Play sound and show notification
                showNotification('Work session complete! Take a 5-minute break.', 'success');
              } else {
                // Switch to work time
                isWorkTime = true;
                minutes = 25;
                seconds = 0;
                timerStatus.textContent = 'Work Time';
                timerProgress.classList.remove('bg-success');
                timerProgress.classList.add('bg-primary');
                
                // Play sound and show notification
                showNotification('Break time over! Ready for another Pomodoro?', 'info');
              }
              
              updateDisplay();
              startBtn.disabled = false;
              pauseBtn.disabled = true;
              
            } else {
              minutes--;
              seconds = 59;
            }
          } else {
            seconds--;
          }
          
          updateDisplay();
        }, 1000);
      }
    });
    
    // Pause timer
    pauseBtn.addEventListener('click', () => {
      if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
      }
    });
    
    // Reset timer
    resetBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isRunning = false;
      isWorkTime = true;
      minutes = 25;
      seconds = 0;
      timerStatus.textContent = 'Work Time';
      timerProgress.classList.remove('bg-success');
      timerProgress.classList.add('bg-primary');
      timerProgress.style.width = '0%';
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    });
    
    // Initial display update
    updateDisplay();
  }
  
  // Initialize charts
  function initializeCharts() {
    // Study Progress Chart
    const studyProgressCtx = document.getElementById('studyProgressChart');
    if (studyProgressCtx) {
      new Chart(studyProgressCtx, {
        type: 'line',
        data: {
          labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          datasets: [{
            label: 'Study Hours',
            data: [3.5, 4.2, 2.8, 5.1, 3.9, 2.5, 2.5],
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            backgroundColor: 'rgba(126, 158, 255, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Hours'
              }
            }
          }
        }
      });
    }
    
    // Subject Performance Chart
    const subjectPerformanceCtx = document.getElementById('subjectPerformanceChart');
    if (subjectPerformanceCtx) {
      new Chart(subjectPerformanceCtx, {
        type: 'radar',
        data: {
          labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'History', 'Literature'],
          datasets: [{
            label: 'Current Performance',
            data: [85, 72, 78, 90, 68, 75],
            backgroundColor: 'rgba(126, 158, 255, 0.2)',
            borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim(),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: {
                display: true
              },
              suggestedMin: 0,
              suggestedMax: 100
            }
          }
        }
      });
    }
  }
  
  // Get course recommendations using Gemini API
  async function getCourseRecommendations(domain) {
    try {
      const apiKey = 'AIzaSyBNZTpNpPmADwaA_MX_QfFVUSFHfUbnB7U';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      // Format domain for better readability
      const formattedDomain = domain.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create prompt for Gemini
      const prompt = `
        Recommend 5-8 high-quality online courses for someone interested in learning ${formattedDomain}.
        
        For each course, provide:
        1. Course name
        2. Provider (e.g., Coursera, Udemy, edX, etc.)
        3. Brief description (1-2 sentences)
        4. Estimated duration (in weeks or hours)
        5. Difficulty level (Beginner, Intermediate, Advanced)
        6. A fictional but realistic URL
        
        Format the response as JSON with the following structure:
        {
          "courses": [
            {
              "name": "Course Name",
              "provider": "Provider Name",
              "description": "Brief course description",
              "duration": "X weeks",
              "level": "Beginner/Intermediate/Advanced",
              "url": "https://example.com/course"
            }
          ]
        }
      `;
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract the generated content
      const generatedText = data.candidates[0].content.parts[0].text;
      
      // Try to parse the JSON response
      try {
        // Find JSON in the response (it might be surrounded by markdown code blocks)
        const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || 
                          generatedText.match(/```\n([\s\S]*?)\n```/) || 
                          [null, generatedText];
        
        const jsonContent = jsonMatch[1] || generatedText;
        const courseRecommendations = JSON.parse(jsonContent);
        
        console.log('Course recommendations generated successfully:', courseRecommendations);
        return courseRecommendations;
        
      } catch (jsonError) {
        console.error('Error parsing API response as JSON:', jsonError);
        console.log('Raw API response:', generatedText);
        
        // Create a fallback response with a message about the error
        return {
          courses: [
            {
              name: "Error parsing recommendations",
              provider: "System",
              description: "There was an error getting course recommendations. Please try again later.",
              duration: "N/A",
              level: "N/A",
              url: "#"
            }
          ]
        };
      }
      
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
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
  
  // Handle task checkboxes
  document.querySelectorAll('.task-list .form-check-input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      if ( this.checked) {
        showNotification(`Task "${this.nextElementSibling.textContent.trim()}" marked as complete!`, 'success');
      }
    });
  });
  
  // Handle Complete Session button
  const completeSessionBtn = document.getElementById('complete-session-btn');
  if (completeSessionBtn) {
    completeSessionBtn.addEventListener('click', () => {
      // Close the modal
      const studyMethodModal = bootstrap.Modal.getInstance(document.getElementById('studyMethodModal'));
      studyMethodModal.hide();
      
      // Show success message
      showNotification('Study session completed successfully!', 'success');
      
      // Update stats (in a real app, this would be saved to a database)
      setTimeout(() => {
        // Increment study time
        const studyTimeElement = document.querySelector('.stat-info h3');
        if (studyTimeElement) {
          const currentTime = parseFloat(studyTimeElement.textContent);
          studyTimeElement.textContent = (currentTime + 1).toFixed(1) + 'h';
        }
        
        // Add to recent activity
        const activityList = document.querySelector('.activity-list');
        if (activityList) {
          const newActivity = document.createElement('li');
          newActivity.className = 'activity-item';
          newActivity.innerHTML = `
            <div class="activity-icon">
              <i class="bi bi-clock"></i>
            </div>
            <div class="activity-details">
              <h4>Completed a 1-hour study session</h4>
              <p>${document.getElementById('study-method-title').textContent}</p>
              <span class="activity-time">Just now</span>
            </div>
          `;
          activityList.insertBefore(newActivity, activityList.firstChild);
        }
      }, 500);
    });
  }
});