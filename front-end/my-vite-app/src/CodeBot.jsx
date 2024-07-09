import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function CodeBot({ setDescription }) {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    const [search, setSearch] = useState('');
    const [aiResponse, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Generative AI Call to fetch text insights
     */
    async function aiRun() {
        setLoading(true);
        setResponse('');
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = search;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        setDescription(text);  // Update the parent component's state
        setLoading(false);
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
                    <p>{aiResponse}</p>
                </div>
            )}
        </div>
    );
}

export default CodeBot;
