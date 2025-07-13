import io from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const createSocketConnection = () => {
  return io(BACKEND_URL, {
    withCredentials: true,
    transports: ["websocket"],
  });
};