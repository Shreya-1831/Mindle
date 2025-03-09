import { generateTimetable } from './timetable-generator.js';

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
  const loadingIndicator = document.getElementById('loading-indicator');
  const timetableContent = document.getElementById('timetable-content');
  const errorMessage = document.getElementById('error-message');
  const timetableTitle = document.getElementById('timetable-title');
  const timetableSubtitle = document.getElementById('timetable-subtitle');
  const courseName = document.getElementById('course-name');
  const totalHours = document.getElementById('total-hours');
  const weeklySchedule = document.getElementById('weekly-schedule');
  const learningTips = document.getElementById('learning-tips');
  
  // Modal elements
  const editSessionModal = new bootstrap.Modal(document.getElementById('editSessionModal'));
  const editSessionForm = document.getElementById('edit-session-form');
  const editDayIndex = document.getElementById('edit-day-index');
  const editSessionIndex = document.getElementById('edit-session-index');
  const editStartTime = document.getElementById('edit-start-time');
  const editEndTime = document.getElementById('edit-end-time');
  const editTopic = document.getElementById('edit-topic');
  const editMethod = document.getElementById('edit-method');
  const editNotes = document.getElementById('edit-notes');
  const saveSessionBtn = document.getElementById('save-session-btn');
  const deleteSessionBtn = document.getElementById('delete-session-btn');
  
  // Button elements
  const editTimetableBtn = document.getElementById('edit-timetable-btn');
  const saveTimetableBtn = document.getElementById('save-timetable-btn');
  const printTimetableBtn = document.getElementById('print-timetable-btn');
  const retryBtn = document.getElementById('retry-btn');
  
  // Current timetable data
  let currentTimetable = null;
  
  // Initialize timetable generation
  initTimetable();
  
  // Initialize timetable generation
  async function initTimetable() {
    try {
      // Show loading indicator
      loadingIndicator.style.display = 'block';
      timetableContent.style.display = 'none';
      errorMessage.style.display = 'none';
      
      // Get preferences from localStorage
      const preferences = JSON.parse(localStorage.getItem('studyPreferences')) || {};
      
      // Get selected courses from localStorage
      const selectedCourses = JSON.parse(localStorage.getItem('selectedCoursesForTimetable')) || [];
      
      // If no courses are selected, try to get from URL parameters
      if (selectedCourses.length === 0) {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('courseId');
        
        if (courseId) {
          // Get saved courses from localStorage
          const savedCourses = JSON.parse(localStorage.getItem('savedCourses')) || [];
          const courseFromId = savedCourses.find(course => course.id === courseId);
          
          if (courseFromId) {
            selectedCourses.push(courseFromId);
            localStorage.setItem('selectedCoursesForTimetable', JSON.stringify(selectedCourses));
          }
        }
      }
      
      // Check if we have courses and preferences
      if (selectedCourses.length === 0) {
        showError("No courses selected. Please select at least one course first.");
        return;
      }
      
      if (!preferences || !preferences.timetableName) {
        showError("No study preferences found. Please set your preferences first.");
        return;
      }
      
      // Generate timetable
      const timetableData = await generateTimetable(preferences, selectedCourses);
      
      // Store current timetable
      currentTimetable = timetableData;
      
      // Display timetable
      displayTimetable(timetableData, preferences, selectedCourses);
      
    } catch (error) {
      console.error('Error initializing timetable:', error);
      showError("Failed to generate timetable. Please try again.");
    }
  }
  
  // Display timetable
  function displayTimetable(timetableData, preferences, selectedCourses) {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    
    // Check if we have valid timetable data
    if (!timetableData || !timetableData.timetable) {
      showError("Invalid timetable data. Please try again.");
      return;
    }
    
    // Update timetable title and subtitle
    timetableTitle.textContent = timetableData.timetable.name || preferences.timetableName || "Your Study Timetable";
    
    // Create subtitle with course names
    const courseNames = selectedCourses.map(course => course.name).join(', ');
    timetableSubtitle.textContent = `Personalized schedule for ${courseNames}`;
    
    // Update course info
    if (selectedCourses.length === 1) {
      const course = selectedCourses[0];
      courseName.textContent = `${course.name} (${course.level}, ${course.duration})`;
    } else {
      courseName.textContent = `${selectedCourses.length} courses selected`;
    }
    
    // Update total hours
    totalHours.textContent = `${timetableData.timetable.totalHours || preferences.totalHours} hours per week`;
    
    // Generate weekly schedule
    generateWeeklySchedule(timetableData.timetable.schedule);
    
    // Generate learning tips
    generateLearningTips(timetableData.tips);
    
    // Show timetable content
    timetableContent.style.display = 'block';
  }
  
  // Generate weekly schedule
  function generateWeeklySchedule(schedule) {
    // Clear previous schedule
    weeklySchedule.innerHTML = '';
    
    // Check if schedule exists
    if (!schedule || schedule.length === 0) {
      weeklySchedule.innerHTML = '<p class="text-center text-muted">No schedule available</p>';
      return;
    }
    
    // Sort days in correct order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const sortedSchedule = [...schedule].sort((a, b) => {
      return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
    });
    
    // Generate HTML for each day
    sortedSchedule.forEach((day, dayIndex) => {
      const dayElement = document.createElement('div');
      dayElement.className = 'day-schedule';
      
      // Create day header
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.innerHTML = `
        <span>${day.day}</span>
        <div class="day-actions">
          <button class="btn btn-sm add-session-btn" data-day-index="${dayIndex}">
            <i class="bi bi-plus"></i> Add Session
          </button>
        </div>
      `;
      
      // Create day sessions container
      const daySessions = document.createElement('div');
      daySessions.className = 'day-sessions';
      
      // Add sessions
      if (day.sessions && day.sessions.length > 0) {
        day.sessions.forEach((session, sessionIndex) => {
          const sessionElement = document.createElement('div');
          sessionElement.className = 'session-item';
          
          // Format time
          const timeDisplay = session.startTime && session.endTime ? 
            `${session.startTime} - ${session.endTime}` : 
            'Flexible Time';
          
          // Add course name if available
          const courseDisplay = session.course ? 
            `<div class="course-provider-badge mb-2">${session.course}</div>` : 
            '';
          
          sessionElement.innerHTML = `
            <div class="session-time">${timeDisplay}</div>
            <div class="session-content">
              ${courseDisplay}
              <div class="session-topic">${session.topic || 'Study Session'}</div>
              <div class="session-method">${session.method || 'General Study'}</div>
              ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
            </div>
            <div class="session-actions">
              <button class="edit-session-btn" data-day-index="${dayIndex}" data-session-index="${sessionIndex}">
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          `;
          
          daySessions.appendChild(sessionElement);
        });
      } else {
        // No sessions message
        daySessions.innerHTML = '<div class="session-item"><p class="text-center text-muted">No sessions scheduled</p></div>';
      }
      
      // Append day header and sessions to day element
      dayElement.appendChild(dayHeader);
      dayElement.appendChild(daySessions);
      
      // Append day element to weekly schedule
      weeklySchedule.appendChild(dayElement);
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-session-btn').forEach(button => {
      button.addEventListener('click', () => {
        const dayIndex = button.getAttribute('data-day-index');
        const sessionIndex = button.getAttribute('data-session-index');
        openEditSessionModal(dayIndex, sessionIndex);
      });
    });
    
    // Add event listeners to add session buttons
    document.querySelectorAll('.add-session-btn').forEach(button => {
      button.addEventListener('click', () => {
        const dayIndex = button.getAttribute('data-day-index');
        addNewSession(dayIndex);
      });
    });
  }
  
  // Generate learning tips
  function generateLearningTips(tips) {
    // Clear previous tips
    learningTips.innerHTML = '';
    
    // Check if tips exist
    if (!tips || tips.length === 0) {
      learningTips.innerHTML = '<p class="text-center text-muted">No learning tips available</p>';
      return;
    }
    
    // Generate HTML for each tip
    tips.forEach((tip, index) => {
      const tipElement = document.createElement('div');
      tipElement.className = 'tip-item';
      
      tipElement.innerHTML = `
        <div class="tip-icon">
          <i class="bi bi-lightbulb"></i>
        </div>
        <div class="tip-content">
          <p>${tip}</p>
        </div>
      `;
      
      learningTips.appendChild(tipElement);
    });
  }
  
  // Open edit session modal
  function openEditSessionModal(dayIndex, sessionIndex) {
    // Get session data
    const session = currentTimetable.timetable.schedule[dayIndex].sessions[sessionIndex];
    
    // Set form values
    editDayIndex.value = dayIndex;
    editSessionIndex.value = sessionIndex;
    
    // Convert time format if needed (HH:MM to HH:MM)
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      
      // If time is already in HH:MM format, return as is
      if (timeStr.match(/^\d{1,2}:\d{2}$/)) {
        // Ensure it's in 24-hour format with leading zeros
        const [hours, minutes] = timeStr.split(':');
        return `${hours.padStart(2, '0')}:${minutes}`;
      }
      
      // If time is in another format, try to convert
       try {
        const timeParts = timeStr.match(/(\d{1,2})(?::(\d{2}))?/);
        if (timeParts) {
          const hours = timeParts[1].padStart(2, '0');
          const minutes = (timeParts[2] || '00').padStart(2, '0');
          return `${hours}:${minutes}`;
        }
      } catch (e) {
        console.error('Error formatting time:', e);
      }
      
      return '';
    };
    
    editStartTime.value = formatTime(session.startTime);
    editEndTime.value = formatTime(session.endTime);
    editTopic.value = session.topic || '';
    editMethod.value = session.method || 'Reading';
    editNotes.value = session.notes || '';
    
    // Show modal
    editSessionModal.show();
  }
  
  // Add new session
  function addNewSession(dayIndex) {
    // Create a new empty session
    const newSession = {
      startTime: '09:00',
      endTime: '10:30',
      topic: 'New Study Session',
      method: 'Reading',
      notes: ''
    };
    
    // Add to current timetable
    currentTimetable.timetable.schedule[dayIndex].sessions.push(newSession);
    
    // Regenerate weekly schedule
    generateWeeklySchedule(currentTimetable.timetable.schedule);
    
    // Open edit modal for the new session
    const sessionIndex = currentTimetable.timetable.schedule[dayIndex].sessions.length - 1;
    openEditSessionModal(dayIndex, sessionIndex);
  }
  
  // Save session changes
  saveSessionBtn.addEventListener('click', () => {
    // Get form values
    const dayIndex = parseInt(editDayIndex.value);
    const sessionIndex = parseInt(editSessionIndex.value);
    
    // Update session data
    currentTimetable.timetable.schedule[dayIndex].sessions[sessionIndex] = {
      ...currentTimetable.timetable.schedule[dayIndex].sessions[sessionIndex],
      startTime: editStartTime.value,
      endTime: editEndTime.value,
      topic: editTopic.value,
      method: editMethod.value,
      notes: editNotes.value
    };
    
    // Regenerate weekly schedule
    generateWeeklySchedule(currentTimetable.timetable.schedule);
    
    // Hide modal
    editSessionModal.hide();
    
    // Show notification
    showNotification('Session updated successfully', 'success');
  });
  
  // Delete session
  deleteSessionBtn.addEventListener('click', () => {
    // Get indices
    const dayIndex = parseInt(editDayIndex.value);
    const sessionIndex = parseInt(editSessionIndex.value);
    
    // Remove session
    currentTimetable.timetable.schedule[dayIndex].sessions.splice(sessionIndex, 1);
    
    // Regenerate weekly schedule
    generateWeeklySchedule(currentTimetable.timetable.schedule);
    
    // Hide modal
    editSessionModal.hide();
    
    // Show notification
    showNotification('Session deleted', 'info');
  });
  
  // Save timetable
  saveTimetableBtn.addEventListener('click', () => {
    try {
      // Get saved timetables from localStorage
      const savedTimetables = JSON.parse(localStorage.getItem('savedTimetables')) || [];
      
      // Create timetable object with metadata
      const timetableToSave = {
        id: `timetable-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...currentTimetable
      };
      
      // Add to saved timetables
      savedTimetables.push(timetableToSave);
      
      // Save to localStorage
      localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));
      
      // Show notification
      showNotification('Timetable saved successfully', 'success');
      
    } catch (error) {
      console.error('Error saving timetable:', error);
      showNotification('Failed to save timetable', 'error');
    }
  });
  
  // Print timetable
  printTimetableBtn.addEventListener('click', () => {
    window.print();
  });
  
  // Retry button
  retryBtn.addEventListener('click', () => {
    initTimetable();
  });
  
  // Edit timetable button
  editTimetableBtn.addEventListener('click', () => {
    // Redirect to course selection page
    window.location.href = 'course-recommendation.html';
  });
  
  // Show error message
  function showError(message) {
    loadingIndicator.style.display = 'none';
    timetableContent.style.display = 'none';
    
    // Update error message
    const errorText = document.querySelector('#error-message p');
    if (errorText) {
      errorText.textContent = message;
    }
    
    // Show error message
    errorMessage.style.display = 'block';
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