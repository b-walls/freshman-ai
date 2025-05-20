import React, { useState, useRef, useEffect } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import AIMessage from "./AIMessage";
import HumanMessage from "./HumanMessage";
import ChatHeader from "./ChatHeader";
import InputBar from "./InputBar";

const btnStyle = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  zIndex: 99999,
  background: "#450084",
  color: "white",
  border: "none",
  borderRadius: "50%",
  width: "56px",
  height: "56px",
  fontSize: "28px",
  cursor: "pointer",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const chatWindowStyle = {
  position: "fixed",
  bottom: "90px",
  right: "24px",
  width: "350px",
  height: "500px",
  background: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
  zIndex: 10000,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  border: "3px solid #450084",
};

const chatMessagesStyle = {
  flex: 1,
  display: "flex",
  overflowY: "auto",
  padding: "8px",
  flexDirection: "column"
}

const sampleAIText = "Hello! How can I help you today?"
const sampleHumanText = "When is orientation?"
function ChatExtension() {
  // Open button
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Messages datastructure
  const [messages, setMessages] = useState([
    { text: sampleAIText, sender: "ai" }
  ]);

  const messagesEndRef = useRef(null);

  // Add ref to force scroll when messages extend out of frame
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages, open]);

  // handle a query from user
  const handleSend = async (message) => {
    setMessages(prev => [...prev, { text: message, sender: "human" }]);

    try {
    setLoading(true);
    const response = await fetch("http://localhost:8000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query: message })
    });
    const data = await response.json();

    // Add the AI's response to the chat
    setLoading(false);
    setMessages(prev => [...prev, { text: data.answer, sender: "ai" }]);
  } catch (error) {
    setLoading(false);
    setMessages(prev => [
      ...prev,
      { text: "Sorry, there was an error contacting the AI.", sender: "ai" }
    ]);
  }

  };

  return (
    <>
      {open && (
        <div style={chatWindowStyle}>
          <ChatHeader />
          <div style={chatMessagesStyle} ref={messagesEndRef}>
            {messages.map((msg, idx) =>
              msg.sender === "ai" ? (
                <AIMessage key={idx} text={msg.text} />
              ) : (
                <HumanMessage key={idx} text={msg.text} />
              )
            )}
            {loading ? (
              <AIMessage text={"..."}/>
            ) : (
              <></>
            )}
          </div>
          <InputBar onSend={handleSend} />
        </div>
      )}
      <button
        style={btnStyle}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
      >
        <IoChatbubblesOutline />
      </button>
    </>
  );
}

export default ChatExtension;