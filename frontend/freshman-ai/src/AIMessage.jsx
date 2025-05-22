import React from 'react'
import { RiRobot2Line } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';

const aiChatStyle = {
  background: "#CBB677",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #333",
  alignSelf: "flex-start",
  maxWidth: "70%",
  wordBreak: "break-word"
}

const robotIconStyle = {
  padding: "2px",
  borderRadius: "50%",
  border: "1px solid #333"
}

const aiMessageRowStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: "8px",
  marginBottom: "15px"
}

function AIMessage({text}) {
  return (
    <div style={aiMessageRowStyle}>
      <RiRobot2Line size={25} style={robotIconStyle} />
      <div style={aiChatStyle}>
        <ReactMarkdown components={{
          p: (props) => <span {...props} />
        }}>
          {String(text)}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default AIMessage