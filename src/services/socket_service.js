
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
  {
    autoConnect: false,
    transports: ["websocket"]
  }
);

export function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export function onSensorUpdate(callback) {
  socket.on("sensor:update", callback);

  return () => {
    socket.off("sensor:update", callback);
  };
}

export function onSensorLatest(callback) {
  socket.on("sensor:latest", callback);

  return () => {
    socket.off("sensor:latest", callback);
  };
}

export default socket;