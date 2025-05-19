import React, { useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import AIMessage from "./AIMessage";
import HumanMessage from "./HumanMessage";
import ChatHeader from "./ChatHeader";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div style={chatWindowStyle}>
          <ChatHeader/>
          <div style={chatMessagesStyle}>
            <AIMessage text={sampleAIText}/>
            <HumanMessage text={sampleHumanText}/>
          </div>
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