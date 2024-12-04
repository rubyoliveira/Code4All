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
                        placeholder='ask gemini'
                        value={search}
                        className="copilot-input"
                        onChange={handleChangeSearch}
                    />
                    <button className="copilot-search-button" type="button" onClick={handleClick}>
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Copilot;
