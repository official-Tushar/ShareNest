import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { IoMdSend } from "react-icons/io";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const user = useSelector((store) => store.user);

  const userId = user?._id;

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
        withCredentials: true,
      });

      console.log(chat.data.messages);

      const chatMessages = chat?.data?.messages.map((msg) => {
        const { senderId, text } = msg;
        return {
          senderId: senderId?._id,
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          photoUrl: senderId?.photoUrl,
          text,
        };
      });
      setMessages(chatMessages);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };
  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on(
      "messageReceived",
      ({ senderId, firstName, lastName, text, photoUrl }) => {
        console.log(firstName + " : " + text);
        setMessages((prev) => [
          ...prev,
          { senderId, firstName, lastName, text, photoUrl },
        ]);
      }
    );

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="mt-26 mb-8">
      <h1 className="text-xl md:text-2xl font-bold text-center my-3">
        Chat Room
      </h1>
      <div className="w-19/20 sm:w-4/5 md:w-3/4 mx-auto border border-gray-600 m-5 h-[70vh] flex flex-col mt-5">
        <div className="flex-1 overflow-y-auto p-5 max-h-[60vh]">
          {messages.map((msg, index) => {
            return (
              <div
                key={index}
                className={
                  "chat " +
                  (msg.senderId === userId ? "chat-end" : "chat-start")
                }
              >
                <div className="chat-image avatar">
                  <div className="w-7 xs:w-8 md:w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={msg.photoUrl}
                    />
                  </div>
                </div>
                <div className="chat-header">
                  {msg.senderId === userId
                    ? "You"
                    : `${msg.firstName} ${msg.lastName}`}
                </div>

                <div
                  className={
                    "text-xs xs:text-sm md:text-[16px] chat-bubble " +
                    (user.firstName === msg.firstName
                      ? "chat-bubble-error"
                      : "chat-bubble-info")
                  }
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef}></div>
        </div>
        <div className="p-5 border-t border-gray-600 flex items-center gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="input w-full h-fit py-2 text-xs xs:text-sm md:text-[16px]"
            onKeyDown={handleKeyDown}
          ></input>
          <button onClick={sendMessage} className="btn btn-primary h-fit py-2 text-xs xs:text-sm md:text-[16px] sm:block hidden">
            Send
          </button>
          <button onClick={sendMessage} className="btn btn-primary h-fit py-2 text-xs xs:text-sm md:text-[16px] block sm:hidden">
            <IoMdSend />
          </button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
