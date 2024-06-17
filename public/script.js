const socket = io('/');
const videoGrid = document.getElementById('-video-grid');

const myPeer = new Peer(undefined, {
    host: '/',
    port: 3001
});

const myVideo = document.createElement('video');
myVideo.muted = true;
myVideo.autoplay = true; // Ensure autoplay is set on the video element

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
})
.then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream); // Answer the call with your stream
        const video = document.createElement('video');
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream); // Show remote user's video
        });
        call.on('close', () => {
            video.remove(); // Remove the video element when the call ends
        });
    });

    socket.on('user-connected', userId => {
        console.log("User connected " + userId);
        connectNewUser(userId, stream); // Call function to connect to a new user
    });
})
.catch(error => {
    console.error('Error accessing media devices:', error);
});

function connectNewUser(userId, stream) {
    const call = myPeer.call(userId, stream); // Call the new user with your stream
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream); // Show remote user's video
    });
    call.on('close', () => {
        video.remove(); // Remove the video element when the call ends
    });
}

myPeer.on('open', id => {
    socket.emit('join-room', roomId, id);
});

socket.on('user-connected', userId => {
    console.log("User connected " + userId);
});

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}
