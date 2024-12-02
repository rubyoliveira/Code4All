import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import "./CodePad.css"

function Copilot({ setDescription, username}) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const [search, setSearch] = useState('');
    const [prompt, setPrompt] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGreet, setShowGreet] = useState(true);
    const [history, setHistory] = useState([]);

    async function aiRun() {
        setShowGreet(false);
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [],
        });
        const prompt = search;
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();
        setPrompt(prompt);
        setResponse(text);
        setDescription(text);
        setLoading(false);
        setHistory(prevHistory => [...prevHistory, { prompt, response: text }]);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
        setPrompt(search);
        setSearch('')
    }

    return (
        <div className = "copilot">
            {showGreet && <div className="greet">
                <h3>Hello, {username}!</h3>
            </div>}
            <div className="chat-log">
                {history.map((item, index) => (
                    <div key={index} className="chat-message">
                        <strong>{username}:</strong>
                        <div className="prompt">
                            <p>{item.prompt}</p>
                        </div>
                        <div style={{ margin: '30px 0' }} >
                            <strong>AI:</strong>
                            <ReactMarkdown className="ai-response">{item.response}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                <div>
                    {loading && (
                        <div>
                            <p className="prompt">{prompt}</p>
                            <p style={{ margin: '30px 0' }}>Loading...</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="copilot-bottom">
                <div style={{ display: 'flex' }} className="copilot-search">
                    <input
                        placeholder='Create Description of Course'
                        value={search}
                        className="copilot-input"
                        onChange={handleChangeSearch}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"  style={{ marginLeft: '20px' }} onClick={handleClick} className="copilot-run">
                        <path fillRule="evenodd" d="M15.328 1.294a.798.798 0 0 0-.034-.174c-.006-.02-.013-.046-.026-.066A.65.65 0 0 0 15.14.86a.648.648 0 0 0-.267-.153.567.567 0 0 0-.146-.027.338.338 0 0 0-.087-.013.478.478 0 0 0-.193.04h-.007c-.013.007-.02.007-.033.013L1.114 5.374a.66.66 0 0 0-.446.6.658.658 0 0 0 .393.633l5.78 2.567 2.56 5.766c.107.247.36.407.633.394a.668.668 0 0 0 .6-.447l4.667-13.333a.743.743 0 0 0 .033-.207c0-.02-.006-.04-.006-.053ZM12.12 2.94 7.188 7.874l-4.047-1.8 8.98-3.134Zm-2.187 9.927L8.128 8.814l4.96-4.96-3.154 9.013Z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Copilot;
