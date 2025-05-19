import React from 'react'
import { RiRobot2Line } from "react-icons/ri";

const chatHeaderStyle = {
  borderBottom: "1px solid #333",
  background: "#450084",
  color: "#ffffff",
  height: "50px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "center",
  paddingLeft: "2%",
  paddingTop: "2px",
  gap: "4px"
};

const headerTextStyle = {
  fontWeight: "bold",
  fontSize: "1.3em",
  letterSpacing: "1px",
  display: "flex",
  alignItems: "center",
  gap: "8px"
};

const subtextStyle = {
  fontSize: "0.8em",
  opacity: 0.7,
};

function ChatHeader() {
  return (
    <div>
      <div style={chatHeaderStyle}>
        <div style={headerTextStyle}>
          <RiRobot2Line size={22} />
          Duke Dog AI
        </div>
        <div style={subtextStyle}>
          Not affiliated with JMU
        </div>
      </div>
    </div>
  );
}

export default ChatHeader