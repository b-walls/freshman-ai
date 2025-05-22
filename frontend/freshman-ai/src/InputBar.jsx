import { useState } from 'react'
import { IoIosSend } from "react-icons/io";

const inputComponentStyle = {
  borderTop: "1px solid #333",
  height: "10%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  paddingLeft: "5px",
  paddingRight: "5px"
}

const inputButtonStyle = {
  background: "#450084",
  height: "60%",
  borderRadius: "5px",
  color: "white",
  alignItems: "center",
  display: "flex",
  cursor: "pointer"
}

const inputFieldStyle = {
  width: "80%",
  padding: "5px",
  borderRadius: "5px",
  border: "1px solid #333",
  background: "#d7d7d8"
}

function InputBar({onSend}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim() && onSend) {
      onSend(value);
      setValue("");
    }
  };

  return (
    <div style={inputComponentStyle}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type your message..."
        style={{
          ...inputFieldStyle,
          color: value ? "#000" : "#909497"
        }}
        onKeyDown={e => {
          if (e.key == "Enter") handleSend();
        }}
      />
      <button style={inputButtonStyle} onClick={handleSend}>
        <IoIosSend size={20} style={{padding: "5px"}}/>
      </button>
    </div>
  )
}

export default InputBar