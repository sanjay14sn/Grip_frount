import { io } from "socket.io-client";
import { server } from "./config";

const socket = io(server, {
  autoConnect: false,
  transports: ["websocket"],
});

let pendingRegistration = null;

const handleRegistration = (memberId) => {
  if (memberId) {
    console.log("Attempting to register member:", memberId);
    socket.emit("registerResp", memberId);
    
    // Listen for registration confirmation
    const onRegistered = () => {
      console.log(`Socket successfully registered for member: ${memberId}`);
      socket.off('registered', onRegistered); // Clean up listener
    };
    
    socket.on('registered', onRegistered);
  }
};

export const connectSocket = (memberId) => {
  if (!socket.connected) {
    console.log("Connecting socket...");
    pendingRegistration = memberId; // Store memberId for after connection
    socket.connect();
  } else if (memberId) {
    // If already connected, register immediately
    handleRegistration(memberId);
  }
};

export const registerSocket = (memberId) => {
  if (socket.connected) {
    handleRegistration(memberId);
  } else {
    // If not connected, connect and register
    connectSocket(memberId);
  }
};

export const listenForEvent = (event, callback) => {
  socket.on(event, callback);
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
  pendingRegistration = null;
};

// Handle connection events
socket.on("connect", () => {
  console.log("Socket connected with ID:", socket.id);
  
  // If there's a pending registration, handle it now that we're connected
  if (pendingRegistration) {
    handleRegistration(pendingRegistration);
    pendingRegistration = null;
  }
});

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason);
  pendingRegistration = null;
});

socket.on("connect_error", (err) => {
  console.error("Socket connection error:", err);
  pendingRegistration = null;
});

export default socket;
