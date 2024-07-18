import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';
import "./CodePad.css"

function Copilot({ setDescription, username }) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const [search, setSearch] = useState('');
    const [prompt, setPrompt] = useState('')
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [showGreet, setShowGreet] = useState(true)

    async function aiRun() {
        setShowGreet(false);
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({
            history: [],
        })
        const prompt = search;
        const result = await chat.sendMessage(prompt)
        const response = await result.response;
        const text = response.text();
        setPrompt(prompt)
        setResponse(text);
        setDescription(text);
        setLoading(false);
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
        setPrompt(search);
    }

    return (
        <div>
            {showGreet && <div className = "greet">
                <h3>Hello, {username}!</h3>
            </div>}
            <div className = "chat-log">
                <div className = "prompt">
                   <p>{prompt}</p>
                </div>
                <div>
                {loading ? (
                    <p style={{ margin: '30px 0' }}>Loading...</p>
                ) : (
                <div style={{ margin: '30px 0' }}>
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
                )}
            </div>
        </div>
            <div className = "copilot-bottom">
                <div style={{ display: 'flex' }} className = "copilot-search">
                    <input
                        placeholder='Create Description of Course'
                        value={search}
                        className = "copilot-input"
                        onChange={handleChangeSearch}
                    />
                    <button type="button" style={{ marginLeft: '20px' }} onClick={handleClick} className = "copilot-run">
                    🔎
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Copilot;
