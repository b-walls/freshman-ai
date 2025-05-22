const HumanChatStyle = {
  background: "#450084",
  color: "white",
  padding: "12px",
  margin: "2px",
  borderRadius: "12px",
  border: "1px solid #333",
  alignSelf: "flex-end",
  maxWidth: "70%",
  wordBreak: "break-word",
  marginBottom: "15px"
}

function HumanMessage({text}) {
  return (
    <div style={HumanChatStyle}>
      <span>{text}</span>
    </div>
  )
}

export default HumanMessage