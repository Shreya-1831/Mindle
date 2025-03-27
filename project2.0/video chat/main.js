import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';

let peer = null;
let localStream = null;
let currentRoom = null;
let connections = new Map();

const videoGrid = document.getElementById('video-grid');
const localVideo = document.getElementById('local-video');
const createRoomBtn = document.getElementById('create-room');
const joinRoomBtn = document.getElementById('join-room');
const leaveRoomBtn = document.getElementById('leave-room');
const roomIdInput = document.getElementById('room-id');
const copyRoomIdBtn = document.getElementById('copy-room-id');
const toggleVideoBtn = document.getElementById('toggle-video');
const toggleAudioBtn = document.getElementById('toggle-audio');
const connectionStatus = document.getElementById('connection-status');

async function initializeMedia() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        localVideo.srcObject = localStream;
        return true;
    } catch (error) {
        console.error('Error accessing media devices:', error);
        return false;
    }
}

function initializePeer() {
    return new Promise((resolve) => {
        peer = new Peer(uuidv4());
        
        peer.on('open', () => {
            connectionStatus.textContent = 'Connected';
            connectionStatus.classList.replace('bg-danger', 'bg-success');
            resolve();
        });

        peer.on('call', handleIncomingCall);
        peer.on('error', (error) => {
            console.error('PeerJS error:', error);
            connectionStatus.textContent = 'Connection Error';
            connectionStatus.classList.replace('bg-success', 'bg-danger');
        });
    });
}

function handleIncomingCall(call) {
    call.answer(localStream);
    const remoteVideo = createVideoElement();
    
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });

    call.on('close', () => {
        remoteVideo.parentElement.remove();
    });

    connections.set(call.peer, call);
}

function createVideoElement() {
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'col-md-6';
    
    const video = document.createElement('video');
    video.className = 'video-player';
    video.autoplay = true;
    video.playsinline = true;
    
    videoWrapper.appendChild(video);
    videoGrid.appendChild(videoWrapper);
    
    return video;
}

// Enable join button when room ID is entered
roomIdInput.addEventListener('input', () => {
    const roomId = roomIdInput.value.trim();
    joinRoomBtn.disabled = !roomId;
});

createRoomBtn.addEventListener('click', () => {
    currentRoom = uuidv4();
    roomIdInput.value = currentRoom;
    copyRoomIdBtn.disabled = false;
    leaveRoomBtn.disabled = false;
});

joinRoomBtn.addEventListener('click', async () => {
    const roomId = roomIdInput.value.trim();
    if (!roomId || !peer) return;

    try {
        const call = peer.call(roomId, localStream);
        const remoteVideo = createVideoElement();
        
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });

        call.on('error', (error) => {
            console.error('Call error:', error);
            remoteVideo.parentElement.remove();
        });

        call.on('close', () => {
            remoteVideo.parentElement.remove();
        });

        connections.set(call.peer, call);
        currentRoom = roomId;
        leaveRoomBtn.disabled = false;
        joinRoomBtn.disabled = true;
    } catch (error) {
        console.error('Error joining room:', error);
    }
});

copyRoomIdBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(currentRoom);
});

leaveRoomBtn.addEventListener('click', () => {
    connections.forEach(connection => connection.close());
    connections.clear();
    currentRoom = null;
    leaveRoomBtn.disabled = true;
    copyRoomIdBtn.disabled = true;
    joinRoomBtn.disabled = !roomIdInput.value.trim();
    roomIdInput.value = '';
    
    // Remove all remote videos
    const videos = videoGrid.querySelectorAll('.col-md-6:not(:first-child)');
    videos.forEach(video => video.remove());
});

toggleVideoBtn.addEventListener('click', () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    toggleVideoBtn.querySelector('i').classList.toggle('bi-camera-video');
    toggleVideoBtn.querySelector('i').classList.toggle('bi-camera-video-off');
});

toggleAudioBtn.addEventListener('click', () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    toggleAudioBtn.querySelector('i').classList.toggle('bi-mic');
    toggleAudioBtn.querySelector('i').classList.toggle('bi-mic-mute');
});

// Initialize the application
async function initialize() {
    const mediaInitialized = await initializeMedia();
    if (mediaInitialized) {
        await initializePeer();
    }
}

initialize();