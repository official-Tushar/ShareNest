import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createSocketConnection = () => {
  // Always connect to the backend URL, both locally and in production
  return io(BACKEND_URL, {
    withCredentials: true,
    path: "/api/socket.io", // if your backend uses a custom path, otherwise remove this line
    transports: ["websocket"], // optional, can help with CORS/proxy issues
  });
};