import React from 'react';
import { RiRobot2Line } from "react-icons/ri";

const aiChatStyle = {
	background: "#CBB677",
	padding: "10px",
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

const loaderStyle = {
	display: 'flex',
	gap: '5px',
};

const dotBaseStyle = {
	width: '5px',
	height: '5px',
	backgroundColor: '#414141',
	borderRadius: '50%',
	animation: 'bounce 0.9s infinite ease-in-out',
};

function LoadingMessage() {
	return (
		<>
		<div style={aiMessageRowStyle}>
			<RiRobot2Line size={25} style={robotIconStyle} />
			<div style={aiChatStyle}>
				<style>
					{`
					@keyframes bounce {
							0%, 100% {
							transform: translateY(0);
							opacity: 0.3;
							}
							50% {
							transform: translateY(-2px);
							opacity: 1;
							}
					}
					`}
			</style>
			<div style={loaderStyle}>
					<div style={{ ...dotBaseStyle, animationDelay: '0s' }} />
					<div style={{ ...dotBaseStyle, animationDelay: '0.1s' }} />
					<div style={{ ...dotBaseStyle, animationDelay: '0.2s' }} />
				</div>
			</div>
		</div>
		</>
	);
}

export default LoadingMessage;