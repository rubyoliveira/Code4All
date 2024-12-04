import React, { useState } from 'react';
import './CodePad.css';

const Chat = ({ chatMessages, sendMessage, username }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() === '') return;
        sendMessage(message);
        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {chatMessages.map((msg, index) => (
                    <div key={index} className="chat-message">
                        <span className="chat-username" style={{ color: msg.color }}>
                            {msg.username}:
                        </span>
                        <span className="chat-text">{msg.text}</span>
                    </div>
                ))}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    className="chat-input-field"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                />
                <button className = "send-button"onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
