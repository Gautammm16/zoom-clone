// const socket = io('/');
// const videoGrid = document.getElementById('video-grid');

// const myPeer = new Peer(undefined, {
//     host: '/',
//     port: 3001
// });

// const myVideo = document.createElement('video');
// myVideo.muted = true;
// myVideo.autoplay = true; // Ensure autoplay is set on the video element
// myVideo.playsinline = true; // Ensure video works on mobile devices

// navigator.mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
// }).then(stream => {
//     addVideoStream(myVideo, stream);

//     myPeer.on('call', call => {
//         call.answer(stream); // Answer the call with your stream
//         const video = document.createElement('video');
//         video.autoplay = true; // Ensure autoplay is set on the video element
//         video.playsinline = true; // Ensure video works on mobile devices
//         call.on('stream', userVideoStream => {
//             addVideoStream(video, userVideoStream); // Show remote user's video
//         });
//         call.on('close', () => {
//             video.remove(); // Remove the video element when the call ends
//         });
//     });

//     socket.on('user-connected', userId => {
//         console.log(`User connected: ${userId}`);
//         connectNewUser(userId, stream); // Call function to connect to a new user
//     });

//     socket.on('user-disconnected', userId => {
//         if (peers[userId]) peers[userId].close();
//         console.log(`User disconnected: ${userId}`);
//     });
// }).catch(error => {
//     console.error('Error accessing media devices:', error);
// });

// const peers = {}; // Store peers to handle disconnection

// function connectNewUser(userId, stream) {
//     const call = myPeer.call(userId, stream); // Call the new user with your stream
//     const video = document.createElement('video');
//     video.autoplay = true;
//     video.playsinline = true; // Ensure video works on mobile devices
//     call.on('stream', userVideoStream => {
//         addVideoStream(video, userVideoStream); // Show remote user's video
//     });
//     call.on('close', () => {
//         video.remove(); // Remove the video element when the call ends
//     });
//     peers[userId] = call; // Save the call to the peers object
// }

// myPeer.on('open', id => {
//     console.log(`Peer connected with ID: ${id}`);
//     socket.emit('join-room', roomId, id);
// });

// function addVideoStream(video, stream) {
//     video.srcObject = stream;
//     video.addEventListener('loadedmetadata', () => {
//         video.play();
//     });
//     videoGrid.append(video);
// }


const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myPeer = new peers(undefined, {
  host: '/',
  port: '3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream)

  myPeer.on('call', call => {
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
  socket.emit('join-room', roomId, id)
})
console.log("this is room id",roomId); 

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream) {
  video.srcObject = stream
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}