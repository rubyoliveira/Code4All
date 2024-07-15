import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

function CodeBot({ setDescription }) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    async function aiRun() {
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = search;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        setDescription(text);
        setLoading(false);
        console.log(response)
    }

    const handleChangeSearch = (e) => {
        setSearch(e.target.value);
    }

    const handleClick = () => {
        aiRun();
    }

    return (
        <div>
            <div style={{ display: 'flex' }}>
                <input
                    placeholder='Create Description of Course'
                    value={search}
                    onChange={handleChangeSearch}
                />
                <button type="button" style={{ marginLeft: '20px' }} onClick={handleClick}>
                    Search
                </button>
            </div>
            {loading ? (
                <p style={{ margin: '30px 0' }}>Loading...</p>
            ) : (
                <div style={{ margin: '30px 0' }}>
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default CodeBot;
