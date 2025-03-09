// Timetable Generator using Gemini API
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with the provided key
const API_KEY = "AIzaSyAFpAEJPKne7-kV8nQDLNd9tUBDW77jO5s";
const genAI = new GoogleGenerativeAI(API_KEY);

// Function to generate a timetable based on user preferences and selected courses
export async function generateTimetable(preferences, selectedCourses) {
  try {
    // Access the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Format the preferences and course information for the prompt
    const prompt = createTimetablePrompt(preferences, selectedCourses);
    
    // Generate content using Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the generated timetable
    return parseTimetableResponse(text);
  } catch (error) {
    console.error("Error generating timetable:", error);
    // Fallback to local generation if API fails
    return generateFallbackTimetable(preferences, selectedCourses);
  }
}

// Create a detailed prompt for the Gemini API
function createTimetablePrompt(preferences, selectedCourses) {
  // Extract relevant information from preferences
  const {
    timetableName,
    totalHours,
    studyPreference,
    selectedDays,
    selectedMethods
  } = preferences;
  
  // Format the courses information
  const coursesInfo = selectedCourses.map(course => 
    `${course.name} (${course.level} level, ${course.duration})`
  ).join('\n');
  
  // Calculate hours per course (distribute evenly)
  const hoursPerCourse = Math.floor(totalHours / selectedCourses.length);
  
  // Create a structured prompt for better results
  return `
Create a detailed weekly study timetable with the following requirements:

Timetable Name: ${timetableName}
Selected Courses (${selectedCourses.length}):
${coursesInfo}

Total Weekly Study Hours: ${totalHours} hours
Preferred Study Time: ${studyPreference}
Available Days: ${selectedDays.join(', ')}
Study Methods: ${selectedMethods.join(', ')}

Please create a structured timetable that:
1. Distributes the ${totalHours} hours across the selected days evenly
2. Allocates approximately ${hoursPerCourse} hours per course
3. Schedules study sessions during ${studyPreference} hours
4. Varies the study methods throughout the week
5. Includes short breaks between study sessions
6. Provides specific topics to focus on for each session based on the course content
7. Includes review sessions for previously learned material

Format the response as a JSON object with this structure:
{
  "timetable": {
    "name": "Timetable name",
    "totalHours": number,
    "schedule": [
      {
        "day": "Day name",
        "sessions": [
          {
            "startTime": "HH:MM",
            "endTime": "HH:MM",
            "course": "Course name",
            "topic": "Specific topic",
            "method": "Study method",
            "notes": "Additional notes"
          }
        ]
      }
    ]
  },
  "tips": [
    "Learning tip 1",
    "Learning tip 2"
  ]
}
`;
}

// Parse the Gemini API response into a structured timetable object
function parseTimetableResponse(responseText) {
  try {
    // Try to parse the JSON response
    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonString = responseText.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    }
    
    // If JSON parsing fails, extract structured data manually
    const timetable = {
      timetable: {
        name: "Generated Timetable",
        totalHours: 0,
        schedule: []
      },
      tips: []
    };
    
    // Extract days and sessions using regex or string manipulation
    // This is a simplified fallback parser
    const dayMatches = responseText.match(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g);
    
    if (dayMatches) {
      const uniqueDays = [...new Set(dayMatches)];
      
      uniqueDays.forEach(day => {
        timetable.timetable.schedule.push({
          day: day,
          sessions: [
            {
              startTime: "09:00",
              endTime: "10:30",
              course: "Course Introduction",
              topic: "Course Introduction",
              method: "Reading",
              notes: "Focus on fundamentals"
            }
          ]
        });
      });
    }
    
    // Extract tips
    const tipMatches = responseText.match(/Tip \d+:.*?(?=Tip \d+:|$)/gs);
    if (tipMatches) {
      timetable.tips = tipMatches.map(tip => tip.trim());
    }
    
    return timetable;
  } catch (error) {
    console.error("Error parsing timetable response:", error);
    return generateFallbackTimetable();
  }
}

// Generate a fallback timetable if the API fails
function generateFallbackTimetable(preferences, selectedCourses = []) {
  // Extract preferences
  const {
    timetableName = "My Study Plan",
    totalHours = 10,
    studyPreference = "morning",
    selectedDays = ["Monday", "Wednesday", "Friday"],
    selectedMethods = ["Reading", "Practice", "Video Lectures"]
  } = preferences || {};
  
  // Default courses if none provided
  const courses = selectedCourses.length > 0 ? selectedCourses : [
    { name: "Default Course 1", level: "Beginner" },
    { name: "Default Course 2", level: "Intermediate" }
  ];
  
  // Calculate hours per day
  const hoursPerDay = Math.ceil(totalHours / selectedDays.length);
  
  // Determine start time based on preference
  let startHour;
  switch (studyPreference) {
    case "morning": startHour = 8; break;
    case "afternoon": startHour = 13; break;
    case "evening": startHour = 18; break;
    case "night": startHour = 20; break;
    default: startHour = 9;
  }
  
  // Generate schedule
  const schedule = selectedDays.map(day => {
    const sessions = [];
    let currentHour = startHour;
    let remainingHours = hoursPerDay;
    
    while (remainingHours > 0) {
      // Session duration between 1-2 hours
      const duration = Math.min(remainingHours, 1 + Math.floor(Math.random() * 2));
      
      // Select random course, method and generate topic
      const course = courses[Math.floor(Math.random() * courses.length)];
      const method = selectedMethods[Math.floor(Math.random() * selectedMethods.length)];
      const topic = `${course.name} - Module ${Math.floor(Math.random() * 5) + 1}`;
      
      // Add session
      sessions.push({
        startTime: `${currentHour}:00`,
        endTime: `${currentHour + duration}:00`,
        course: course.name,
        topic: topic,
        method: method,
        notes: `Focus on ${course.level.toLowerCase()} concepts`
      });
      
      // Update time and remaining hours
      currentHour += duration;
      remainingHours -= duration;
      
      // Add break if more sessions to come
      if (remainingHours > 0) {
        currentHour += 0.5; // 30 minute break
      }
    }
    
    return {
      day: day,
      sessions: sessions
    };
  });
  
  // Learning tips
  const tips = [
    "Break your study sessions into 25-minute focused intervals with 5-minute breaks (Pomodoro Technique).",
    "Review your notes within 24 hours of learning new material to improve retention.",
    "Teach concepts to someone else to solidify your understanding.",
    "Use spaced repetition to review material at increasing intervals.",
    "Get adequate sleep to help consolidate memory and improve learning."
  ];
  
  return {
    timetable: {
      name: timetableName,
      totalHours: totalHours,
      schedule: schedule
    },
    tips: tips
  };
}