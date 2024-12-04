import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"
import { MonacoBinding } from "y-monaco"
import { useParams, Navigate } from 'react-router-dom';
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { THEME } from "./constants";
import Copilot from "./Copilot";
import "./CodePad.css";

const CodeEditor = ({ username }) => {
    const { idHash } = useParams();
    const editorRef = useRef();
    const [terminate, setTerminate] = useState(false);
    const [IDE, setIDE] = useState({ code: '//pick a language' });
    const [value, setValue] = useState('//pick a language');
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState('');
    const [openAI, setOpenAI] = useState(false);
    const [activeUsers, setActiveUsers] = useState([]);
    const [isReconnecting, setIsReconnecting] = useState(false); // For UI indicators
    const saveTimeout = useRef(null);
    const prevValueRef = useRef('');

    // Fetch languages and interactive session with polling
    useEffect(() => {
        if (!idHash) return; // Prevent fetching without idHash

        fetchLanguages();
        fetchInteractive();

        // Set up polling every 10 seconds
        const intervalId = setInterval(() => {
            fetchInteractive();
        }, 10000); // 10 seconds

        // Cleanup on unmount or termination
        return () => clearInterval(intervalId);
    }, [idHash]);

    // Handle auto-saving code after changes
    useEffect(() => {
        if (value !== prevValueRef.current) {
            if (saveTimeout.current) {
                clearTimeout(saveTimeout.current);
            }
            saveTimeout.current = setTimeout(() => {
                saveCode(value);
                prevValueRef.current = value;
            }, 5000);
            return () => {
                if (saveTimeout.current) {
                    clearTimeout(saveTimeout.current);
                }
            };
        }
    }, [value]);

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

    const saveCode = async (newCode) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}/save`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: newCode }),
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

    const handleClick = () => {
        saveCode(value);
    };

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('myCustomTheme', THEME);
    };

    const getRandomColor = () => {
        const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF", "#33FFF5"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    function onMount(editor, monaco) {
        editorRef.current = editor;
        // Initialize YJS
        const doc = new Y.Doc(); // a collection of shared objects -> Text
        // Connect to peers (or start connection) with WebRTC
        const provider = new WebrtcProvider("test-room", doc); // room1, room2
        const type = doc.getText("monaco"); // doc { "monaco": "what our IDE is showing" }
        // Bind YJS to Monaco 
        const binding = new MonacoBinding(type, editorRef.current.getModel(), new Set([editorRef.current]), provider.awareness);
        console.log(provider.awareness);     
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
                            height="75vh"
                            theme="myCustomTheme"
                            className="code-box"
                            language={language}
                            defaultValue={IDE.code}
                            beforeMount={handleEditorWillMount}
                            onMount={onMount}
                            value={value}
                            // onChange={(newValue) => setValue(newValue)}
                        />
                    </div>
                    <Output editorRef={editorRef} language={language} version={version} idHash={idHash} setTerminate={setTerminate} activeUsers={activeUsers}/>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
