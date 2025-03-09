// Import Firebase services
import { database, ref, set, onValue, remove } from './firebase-config.js';

// Global variables
let localStream = null;
let peer = null;
let currentMeetingId = null;
let connections = {};
let isVideoEnabled = true;
let isAudioEnabled = true;

// DOM elements
const createMeetingBtn = document.getElementById('create-meeting-btn');
const copyMeetingLinkBtn = document.getElementById('copy-meeting-link-btn');
const joinMeetingBtn = document.getElementById('join-meeting-btn');
const meetingIdInput = document.getElementById('meeting-id-input');
const toggleVideoBtn = document.getElementById('toggle-video-btn');
const toggleAudioBtn = document.getElementById('toggle-audio-btn');
const leaveMeetingBtn = document.getElementById('leave-meeting-btn');
const videosGrid = document.getElementById('videos-grid');
const connectionStatus = document.getElementById('connection-status');
const errorMessage = document.getElementById('error-message');

// Initialize the application
async function init() {
  // Check for URL parameters to join a meeting directly
  checkUrlForMeetingId();
  
  // Set up event listeners
  createMeetingBtn.addEventListener('click', createMeeting);
  copyMeetingLinkBtn.addEventListener('click', copyMeetingLink);
  joinMeetingBtn.addEventListener('click', joinMeeting);
  toggleVideoBtn.addEventListener('click', toggleVideo);
  toggleAudioBtn.addEventListener('click', toggleAudio);
  leaveMeetingBtn.addEventListener('click', leaveMeeting);
  
  // Initialize UI
  toggleVideoBtn.classList.add('active');
  toggleAudioBtn.classList.add('active');
}

// Check URL for meeting ID parameter
function checkUrlForMeetingId() {
  const urlParams = new URLSearchParams(window.location.search);
  const meetingId = urlParams.get('meeting');
  
  if (meetingId) {
    meetingIdInput.value = meetingId;
    joinMeeting();
  }
}

// Create a new meeting
async function createMeeting() {
  try {
    // Get user media
    await setupLocalStream();
    
    // Generate a unique meeting ID
    currentMeetingId = uuid.v4();
    
    // Store meeting in Firebase
    await storeMeetingInFirebase(currentMeetingId);
    
    // Initialize PeerJS
    initializePeer(currentMeetingId);
    
    // Update UI
    updateConnectionStatus('Creating meeting...');
    copyMeetingLinkBtn.disabled = false;
    createMeetingBtn.disabled = true;
    
    // Add meeting ID to URL without reloading the page
    updateUrlWithMeetingId(currentMeetingId);
    
    showMessage('Meeting created! Share the link to invite others.');
  } catch (error) {
    handleError('Failed to create meeting', error);
  }
}

// Store meeting information in Firebase
async function storeMeetingInFirebase(meetingId) {
  try {
    const meetingRef = ref(database, `meetings/${meetingId}`);
    await set(meetingRef, {
      createdAt: new Date().toISOString(),
      active: true
    });
    
    // Set up a listener to remove the meeting when it's no longer active
    onValue(meetingRef, (snapshot) => {
      if (!snapshot.exists() && peer && peer.id === meetingId) {
        // Meeting was deleted, leave the meeting
        leaveMeeting();
      }
    });
    
    return true;
  } catch (error) {
    console.error('Firebase error:', error);
    throw new Error('Failed to store meeting information');
  }
}

// Join an existing meeting
async function joinMeeting() {
  try {
    const meetingId = meetingIdInput.value.trim();
    
    if (!meetingId) {
      showError('Please enter a valid meeting ID');
      return;
    }
    
    // Check if meeting exists in Firebase
    const meetingRef = ref(database, `meetings/${meetingId}`);
    onValue(meetingRef, async (snapshot) => {
      if (snapshot.exists()) {
        try {
          // Get user media
          await setupLocalStream();
          
          // Set current meeting ID
          currentMeetingId = meetingId;
          
          // Initialize PeerJS with a random ID for the joiner
          const joinerId = uuid.v4();
          initializePeer(joinerId);
          
          // Store participant in Firebase
          await set(ref(database, `meetings/${meetingId}/participants/${joinerId}`), {
            joinedAt: new Date().toISOString()
          });
          
          // Update UI
          updateConnectionStatus('Joining meeting...');
          joinMeetingBtn.disabled = true;
          
          // Add meeting ID to URL without reloading the page
          updateUrlWithMeetingId(meetingId);
        } catch (error) {
          handleError('Failed to join meeting', error);
        }
      } else {
        showError('Meeting not found or has ended');
      }
    }, { onlyOnce: true });
  } catch (error) {
    handleError('Failed to join meeting', error);
  }
}

// Initialize PeerJS
function initializePeer(userId) {
  // Create a new Peer instance with more reliable ICE servers
  peer = new Peer(userId, {
    host: '0.peerjs.com',
    secure: true,
    port: 443,
    debug: 1,
    config: {
      'iceServers': [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' },
        { 
          urls: 'turn:global.turn.twilio.com:3478?transport=udp',
          username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
          credential: 'w1WpauIV7YoL6bwOEtf4tbLj0wJJ6sgQtKRc/IPddvA='
        },
        { 
          urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
          username: 'f4b4035eaa76f4a55de5f4351567653ee4ff6fa97b50b6b334fcc1be9c27212d',
          credential: 'w1WpauIV7YoL6bwOEtf4tbLj0wJJ6sgQtKRc/IPddvA='
        }
      ]
    }
  });
  
  // Handle peer open event
  peer.on('open', (id) => {
    console.log('My peer ID is: ' + id);
    updateConnectionStatus('Connected');
    connectionStatus.classList.add('connected');
    
    // If joining a meeting, connect to the host
    if (id !== currentMeetingId) {
      connectToPeer(currentMeetingId);
    }
  });
  
  // Handle incoming connections
  peer.on('connection', (conn) => {
    handleNewConnection(conn);
  });
  
  // Handle incoming calls
  peer.on('call', (call) => {
    call.answer(localStream);
    
    call.on('stream', (remoteStream) => {
      addVideoStream(call.peer, remoteStream, false);
    });
    
    call.on('close', () => {
      removeVideoStream(call.peer);
    });
    
    call.on('error', (err) => {
      console.error('Call error:', err);
      removeVideoStream(call.peer);
    });
  });
  
  // Handle peer errors
  peer.on('error', (err) => {
    console.error('Peer error:', err);
    
    // Handle specific error types
    if (err.type === 'peer-unavailable') {
      showError('The peer you are trying to connect to is not available');
    } else if (err.type === 'network') {
      showError('Network connection error. Please check your internet connection');
    } else if (err.type === 'server-error') {
      showError('Could not connect to the signaling server. Please try again later');
    } else {
      handleError('Connection error', err);
    }
    
    // Try to reconnect after a delay
    setTimeout(() => {
      if (peer && peer.destroyed) {
        initializePeer(userId);
      }
    }, 5000);
  });
  
  // Handle peer disconnection
  peer.on('disconnected', () => {
    console.log('Peer disconnected');
    updateConnectionStatus('Disconnected');
    connectionStatus.classList.remove('connected');
    
    // Try to reconnect
    peer.reconnect();
  });
}

// Connect to another peer
function connectToPeer(peerId) {
  // Create a data connection
  const conn = peer.connect(peerId);
  
  conn.on('open', () => {
    handleNewConnection(conn);
    
    // Call the peer
    const call = peer.call(peerId, localStream);
    
    call.on('stream', (remoteStream) => {
      addVideoStream(peerId, remoteStream, false);
    });
    
    call.on('close', () => {
      removeVideoStream(peerId);
    });
    
    call.on('error', (err) => {
      console.error('Call error:', err);
      removeVideoStream(peerId);
    });
  });
  
  conn.on('error', (err) => {
    console.error('Connection error:', err);
    handleError('Failed to connect to peer', err);
  });
}

// Handle a new peer connection
function handleNewConnection(conn) {
  const peerId = conn.peer;
  
  // Store the connection
  connections[peerId] = conn;
  
  // Handle connection close
  conn.on('close', () => {
    delete connections[peerId];
    removeVideoStream(peerId);
  });
  
  // Handle data
  conn.on('data', (data) => {
    console.log('Received data:', data);
    // Handle any custom messages here
  });
}

// Set up local media stream
async function setupLocalStream() {
  try {
    // Request user media with constraints
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
    
    // Add local video to the grid
    addVideoStream('local', localStream, true);
    
    return localStream;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('Camera and microphone access denied. Please allow access to use this app.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('No camera or microphone found. Please connect a device and try again.');
    } else {
      throw error;
    }
  }
}

// Add a video stream to the grid
function addVideoStream(userId, stream, isLocal) {
  // Check if video already exists
  const existingVideo = document.getElementById(`video-${userId}`);
  if (existingVideo) {
    return;
  }
  
  // Create video wrapper
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'video-wrapper';
  videoWrapper.id = `video-wrapper-${userId}`;
  
  // Create video element
  const video = document.createElement('video');
  video.srcObject = stream;
  video.id = `video-${userId}`;
  video.autoplay = true;
  
  // Local video should be mirrored
  if (isLocal) {
    video.muted = true;
    video.style.transform = 'scaleX(-1)';
  }
  
  // Add user label
  const userLabel = document.createElement('div');
  userLabel.className = 'user-label';
  userLabel.textContent = isLocal ? 'You' : 'Participant';
  
  // Append elements
  videoWrapper.appendChild(video);
  videoWrapper.appendChild(userLabel);
  videosGrid.appendChild(videoWrapper);
  
  // Handle video play event
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  
  // Adjust grid layout
  updateGridLayout();
}

// Remove a video stream from the grid
function removeVideoStream(userId) {
  const videoWrapper = document.getElementById(`video-wrapper-${userId}`);
  if (videoWrapper) {
    videosGrid.removeChild(videoWrapper);
    updateGridLayout();
  }
}

// Update the grid layout based on the number of videos
function updateGridLayout() {
  const videoCount = videosGrid.childElementCount;
  
  if (videoCount <= 1) {
    videosGrid.style.gridTemplateColumns = '1fr';
  } else if (videoCount === 2) {
    videosGrid.style.gridTemplateColumns = '1fr 1fr';
  } else if (videoCount === 3 || videoCount === 4) {
    videosGrid.style.gridTemplateColumns = '1fr 1fr';
  } else {
    videosGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  }
}

// Toggle video
function toggleVideo() {
  if (localStream) {
    const videoTracks = localStream.getVideoTracks();
    if (videoTracks.length > 0) {
      isVideoEnabled = !isVideoEnabled;
      videoTracks[0].enabled = isVideoEnabled;
      
      // Update button state
      toggleVideoBtn.classList.toggle('active', isVideoEnabled);
      toggleVideoBtn.querySelector('.material-icons').textContent = 
        isVideoEnabled ? 'videocam' : 'videocam_off';
    }
  }
}

// Toggle audio
function toggleAudio() {
  if (localStream) {
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      isAudioEnabled = !isAudioEnabled;
      audioTracks[0].enabled = isAudioEnabled;
      
      // Update button state
      toggleAudioBtn.classList.toggle('active', isAudioEnabled);
      toggleAudioBtn.querySelector('.material-icons').textContent = 
        isAudioEnabled ? 'mic' : 'mic_off';
    }
  }
}

// Leave the meeting
function leaveMeeting() {
  // Remove meeting from Firebase if creator
  if (peer && peer.id === currentMeetingId) {
    const meetingRef = ref(database, `meetings/${currentMeetingId}`);
    remove(meetingRef).catch(error => {
      console.error('Error removing meeting from Firebase:', error);
    });
  } else if (currentMeetingId && peer) {
    // Remove participant from Firebase
    const participantRef = ref(database, `meetings/${currentMeetingId}/participants/${peer.id}`);
    remove(participantRef).catch(error => {
      console.error('Error removing participant from Firebase:', error);
    });
  }
  
  // Close all connections
  if (peer) {
    peer.destroy();
    peer = null;
  }
  
  // Stop local stream
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  
  // Clear video grid
  videosGrid.innerHTML = '';
  
  // Reset UI
  currentMeetingId = null;
  connections = {};
  createMeetingBtn.disabled = false;
  joinMeetingBtn.disabled = false;
  copyMeetingLinkBtn.disabled = true;
  updateConnectionStatus('Disconnected');
  connectionStatus.classList.remove('connected');
  
  // Remove meeting ID from URL
  window.history.replaceState({}, document.title, window.location.pathname);
  
  // Remove copyable link container if it exists
  const linkContainer = document.getElementById('copyable-link-container');
  if (linkContainer) {
    linkContainer.remove();
  }
  
  showMessage('You have left the meeting.');
}

// Copy meeting link to clipboard
function copyMeetingLink() {
  if (!currentMeetingId) {
    showError('No active meeting to copy link from');
    return;
  }
  
  const meetingLink = `${window.location.origin}${window.location.pathname}?meeting=${currentMeetingId}`;
  
  // Try multiple methods to copy to clipboard
  copyToClipboard(meetingLink)
    .then(() => {
      showMessage('Meeting link copied to clipboard!');
    })
    .catch(() => {
      showError('Failed to copy automatically. You can manually copy the link below.');
      showCopyableLink(meetingLink);
    });
}

// Helper function to try multiple clipboard copy methods
async function copyToClipboard(text) {
  // Try using the Clipboard API first (most modern browsers)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed:', err);
    }
  }
  
  // Fallback to execCommand method
  try {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    const successful = document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    if (successful) {
      return true;
    }
  } catch (err) {
    console.warn('execCommand failed:', err);
  }
  
  // If we got here, both methods failed
  throw new Error('Could not copy text');
}

// Show a copyable link in the UI
function showCopyableLink(link) {
  // Check if we already have a copyable link element
  let linkContainer = document.getElementById('copyable-link-container');
  
  if (!linkContainer) {
    // Create container
    linkContainer = document.createElement('div');
    linkContainer.id = 'copyable-link-container';
    linkContainer.className = 'copyable-link-container';
    
    // Create input
    const linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.id = 'copyable-link-input';
    linkInput.className = 'copyable-link-input';
    linkInput.readOnly = true;
    linkInput.value = link;
    
    // Create label
    const label = document.createElement('div');
    label.className = 'copyable-link-label';
    label.textContent = 'Meeting Link (Select and copy):';
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button primary-btn';
    copyButton.innerHTML = '<span class="material-icons">content_copy</span> Copy';
    copyButton.addEventListener('click', () => {
      linkInput.select();
      copyToClipboard(link)
        .then(() => {
          showMessage('Meeting link copied to clipboard!');
          copyButton.innerHTML = '<span class="material-icons">check</span> Copied!';
          setTimeout(() => {
            copyButton.innerHTML = '<span class="material-icons">content_copy</span> Copy';
          }, 2000);
        })
        .catch(() => {
          showError('Please select and copy the link manually');
        });
    });
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'copy-button-container';
    buttonContainer.appendChild(copyButton);
    
    // Append elements
    linkContainer.appendChild(label);
    linkContainer.appendChild(linkInput);
    linkContainer.appendChild(buttonContainer);
    
    // Add to DOM after meeting controls
    const meetingControls = document.querySelector('.meeting-controls');
    meetingControls.parentNode.insertBefore(linkContainer, meetingControls.nextSibling);
    
    // Select the text for easy copying
    linkInput.addEventListener('click', function() {
      this.select();
    });
  } else {
    // Update existing input
    const linkInput = document.getElementById('copyable-link-input');
    linkInput.value = link;
  }
}

// Update URL with meeting ID
function updateUrlWithMeetingId(meetingId) {
  const url = new URL(window.location);
  url.searchParams.set('meeting', meetingId);
  window.history.replaceState({}, document.title, url);
}

// Update connection status
function updateConnectionStatus(status) {
  connectionStatus.textContent = status;
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.style.color = '#e74c3c';
  
  // Clear error after 5 seconds
  setTimeout(() => {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }, 5000);
}

// Show message
function showMessage(message) {
  errorMessage.textContent = message;
  errorMessage.style.color = '#2ecc71';
  errorMessage.style.display = 'block';
  
  // Clear message after 5 seconds
  setTimeout(() => {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    errorMessage.style.color = '#e74c3c';
  }, 5000);
}

// Handle errors
function handleError(message, error) {
  console.error(message, error);
  showError(`${message}: ${error.message || 'Unknown error'}`);
  
  // Reset UI if necessary
  updateConnectionStatus('Disconnected');
  connectionStatus.classList.remove('connected');
  createMeetingBtn.disabled = false;
  joinMeetingBtn.disabled = false;
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle page unload
window.addEventListener('beforeunload', () => {
  // Clean up resources
  if (peer) {
    peer.destroy();
  }
  
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
  }
  
  // Remove from Firebase if needed
  if (currentMeetingId && peer) {
    if (peer.id === currentMeetingId) {
      // Creator is leaving, remove the meeting
      const meetingRef = ref(database, `meetings/${currentMeetingId}`);
      remove(meetingRef).catch(() => {});
    } else {
      // Participant is leaving, remove just their entry
      const participantRef = ref(database, `meetings/${currentMeetingId}/participants/${peer.id}`);
      remove(participantRef).catch(() => {});
    }
  }
});