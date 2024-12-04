// CodeEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { useParams, Navigate } from 'react-router-dom';
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import Copilot from "./Copilot";
import Chat from "./Chat"; // Ensure Chat.js is correctly imported
import { THEME } from "./constants"; // Ensure THEME is correctly imported
import "./CodePad.css";

const CodeEditor = ({ username }) => {
    const { idHash } = useParams();
    const editorRef = useRef();
    const [openChat, setOpenChat] = useState(false);
    const [terminate, setTerminate] = useState(false);
    const [IDE, setIDE] = useState({ code: '//pick a language' });
    const [value, setValue] = useState();
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState([]); // Initialized as an array
    const [openAI, setOpenAI] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isReconnecting, setIsReconnecting] = useState(false); // For UI indicators

    useEffect(() => {
        fetchLanguages();
        fetchInteractive();
    }, []);

    const fetchLanguages = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch languages');
            }
            const data = await response.json();
            setLanguages(data);
        } catch (error) {
            console.error('Error fetching languages:', error);
        }
    };

    const fetchInteractive = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error occurred');
            }
            
            const data = await response.json();
            setIDE(data);
            setValue(data.code);
        } catch (error) {
            console.error('Error fetching IDE:', error);
            setTerminate(true);
        }
    };

    const saveCode = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}/save`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: value }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save code');
            }

            const savedData = await response.json();
            // Optionally handle the saved data
        } catch (error) {
            console.error('Error saving code:', error);
            // Optionally set terminate or show a notification
        }
    };

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('myCustomTheme', THEME);
    };

    const getRandomColor = () => {
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const onMount = (editor, monaco) => {
        editorRef.current = editor;
        // Initialize YJS
        const doc = new Y.Doc(); // a collection of shared objects -> Text
        // Connect to peers (or start connection) with WebRTC
        const provider = new WebrtcProvider(`codepad-room-${idHash}`, doc, {
            // Remove or update signaling servers if necessary
            // signaling: ['wss://y-webrtc-eu.fly.dev/'], // Only if you have reliable custom servers
        });
        const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
        // Bind YJS to Monaco 
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
        console.log(provider.awareness);     
        // Define user information
        const user = {
            userId: provider.awareness.clientID,
            name: username,
            color: getRandomColor(),
        };
        // Set the local user's awareness state
        provider.awareness.setLocalStateField('user', user);
        // Listen for awareness changes
        provider.awareness.on('change', () => {
            const states = Array.from(provider.awareness.getStates().values());
            const users = states
                .filter(state => state.user && state.user.userId !== user.userId)
                .map(state => state.user);
            setActiveUsers(users);
        });
        // Initialize shared Yjs array for chat
        const chatArray = doc.getArray('chat');
        // Listen for changes in the chat array
        chatArray.observe(event => {
            const newMessages = chatArray.toArray();
            setChat(newMessages);
        });
        // Function to send a new message
        const sendMessage = (text) => {
            if (text.trim() === '') return; // Prevent empty messages
            chatArray.push([{ username, text, color: user.color, timestamp: Date.now() }]);
        };
        // Attach sendMessage to editorRef for access in child components
        editorRef.current.sendMessage = sendMessage;
        // Store provider and doc for cleanup
        editorRef.current.provider = provider;
        editorRef.current.doc = doc;
    }

    const onSelect = (language) => {
        const selectedLangObj = languages.find(lang => lang.language === language);
        setLanguage(language);
        setVersion(selectedLangObj ? selectedLangObj.version : '');
    };

    if (username === "undefined") {
        return <Navigate to="/" />;
    }

    const getAI = () => { setOpenAI(true); };
    const closeAI = () => { setOpenAI(false); };

    const closeTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
    };

    // Function to handle sending messages from the Chat component
    const handleSendMessage = (text) => {
        if (editorRef.current && editorRef.current.sendMessage) {
            editorRef.current.sendMessage(text);
        }
    };

    // Cleanup Yjs provider and doc on unmount
    useEffect(() => {
        return () => {
            if (editorRef.current) {
                const { provider, doc } = editorRef.current;
                if (provider) provider.destroy();
                if (doc) doc.destroy();
            }
        };
    }, []);

    return (
        <div className="code">
            {terminate && (
                <div className="deleted-alert">
                    <div className="terminate-modal">
                        <p>
                            CodePad session has been terminated, <a onClick={closeTab}>close this tab</a>
                        </p>
                    </div>
                </div>
            )}
            {isReconnecting && (
                <div className="connection-status">
                    Reconnecting to the server...
                </div>
            )}
            <div className="code-pad">
                <div className="ide">
                    <LanguageSelector language={language} onSelect={onSelect} languages={languages} />
                    <div className='code-box'>
                        <Editor
                            height="60vh" // Adjusted height to make space for chat
                            theme="myCustomTheme"
                            className="code-box"
                            language={language}
                            defaultValue={IDE.code}
                            beforeMount={handleEditorWillMount}
                            onMount={onMount}
                            value={value}
                            onChange={(newValue) => setValue(newValue)}
                        />
                    </div>
                    <Output editorRef={editorRef} language={language} version={version} idHash={idHash} setTerminate={setTerminate} activeUsers={activeUsers} saveCode={saveCode}/>
                </div>
                <div className="side-bar">
                    <div className = "chat-copilot">
                        <button className="chat-button" onClick={() => setOpenChat(true)}>
                            Chat
                        </button>
                        <button className="copilot-button"onClick={() => setOpenChat(false)}>
                            Gemini
                        </button>
                    </div>
                    {openChat && (
                        <div className="chat">
                            <Chat chatMessages={chat} sendMessage={handleSendMessage} username={username} />
                        </div>
                    )}
                    {!openChat && <Copilot closeAI={closeAI} username = {username} />}
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
