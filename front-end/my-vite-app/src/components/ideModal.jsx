import React, { useState, useRef, useEffect } from "react";
import './ideModal.css'; // Create this CSS file for styling

const IdeModal = ({closeModal, username}) => {
    const [hashInput, setHashInput] = useState('');

    const openInNewTab = async () => {
        const code = "//code below";
        const users = [];
        const creator = username;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/create-ide`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, users, creator })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const { idHash } = data;
            window.open(`${window.location.origin}/code-pad/${idHash}`, '_blank');
        } catch (error) {
            console.error("Failed to create an IDE session", error);
        }
    };

    const openExistingIDE = async () => {
        if (hashInput.trim() === "") {
            alert("Please enter a valid hash.");
            return;
        }
    
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${hashInput}`, {
                method: 'GET',
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Session not found or has been deleted');
            }
    
            window.open(`${window.location.origin}/code-pad/${hashInput}`, '_blank');
            setHashInput('');
            closeModal();
        } catch (error) {
            console.error("Error:", error);
            alert(error.message || 'Error accessing session');
        }
    };
    

    return (
        <div className = "pop-up">
            <div className="modal">
                <div className = "new-session">
                    <button className="create-new-button" onClick={() => { openInNewTab(); setDropdownOpen(false); }}>
                        Create New Coding Session
                    </button>
                </div>
                <div>
                    <h4>OR</h4>
                </div>
                <div className = "existing">
                    <input
                        type="text"
                        placeholder="enter an existing hash"
                        value={hashInput}
                        onChange={(e) => setHashInput(e.target.value)}
                        className="hash-input"
                    /> 
                    <button onClick={openExistingIDE} className="open-existing-button">
                        Open
                    </button>
                </div>
                <button className="close-modal" onClick={closeModal}>
                    &#10006;
                </button>
            </div>
        </div>
    );
};

export default IdeModal;