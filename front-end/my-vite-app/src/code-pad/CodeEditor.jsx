import React from "react";
import {Editor} from "@monaco-editor/react";
import {useState, useRef, useEffect} from "react";
import { useParams, Navigate } from 'react-router-dom';
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { THEME } from "../constants";
import Copilot from "./Copilot";
import "./CodePad.css";

const CodeEditor = ({username}) => {
    const {idHash} = useParams();
    const editorRef = useRef();
    const [IDE, setIDE] = useState({code: '//language'})
    const [code, setCode] = useState('')
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState('');
    const saveTimeout = useRef(null)
    const prevValueRef = useRef('')


    useEffect(() => {
        fetchLanguages();
        fetchInteractive();
    }, []);

    useEffect(() => {
        if(value !== prevValueRef.current){
            if(saveTimeout.current){
                clearTimeout(saveTimeout.current)
            }
            saveTimeout.current = setTimeout(() => {
                saveCode(value);
                fetchInteractive();
                prevValueRef.current = value;
            }, 1000);
            return () => {
                if(saveTimeout.current){
                    clearTimeout(saveTimeout.current)
                }
            }
        }
    }, [value])

    const fetchLanguages = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad`)
            .then(response => response.json())
            .then(data => setLanguages(data))
            .catch(error => console.error('Error fetching languages:', error));
    };

    const fetchInteractive = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}`)
            .then(response => response.json())
            .then(data => {
                console.log("Received data:", data);
                if (data && data.code ) {
                    const serverCodeLines = data.code.split('\n');
                    const localCodeLines = value.split('\n');
                    const mergedCodeLines = mergeChanges(serverCodeLines, localCodeLines);
                    const mergedCode = mergedCodeLines.join('\n');
                    setIDE(data);
                    setCode(data.code)

                    prevValueRef.current = mergedCode;
                } else {
                    console.error('No code data available');
                }
            })
            .catch(error => console.error('Error fetching IDE:', error));
      };

    const saveCode = (newCode) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}/save`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ code: newCode }),
        })
        .then(response => response.json())
        .catch(error => console.error('Error saving code:', error));
        fetchInteractive();
    };


    const mergeChanges = (serverCodeLines, localCodeLines) => {
        const maxLength = Math.max(serverCodeLines.length, localCodeLines.length);
        const mergedCodeLines = [];

        for (let i = 0; i < maxLength; i++) {
            const serverLine = serverCodeLines[i] || '';
            const localLine = localCodeLines[i] || '';
            if (serverLine !== localLine) {
                mergedCodeLines.push(localLine);
            } else {
                mergedCodeLines.push(serverLine);
            }
        }
        return mergedCodeLines;
    };


    const handleClick = () => {
        saveCode(value);
    };

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('myCustomTheme', THEME);
    };

    const onMount = (editor) => {
        editorRef.current = editor;
        editor.focus();
    };

    const onSelect = (language) => {
        const selectedLangObj = languages.find(lang => lang.language === language);
        setLanguage(language);
        setVersion(selectedLangObj.version);
    };

    if (username === "undefined") {
        return <Navigate to="/" />;
    }

    return (
        <div className="code-pad">
            <div className="code-copilot">
                <Copilot setDescription={setChat} username={username}/>
            </div>
            <div className="ide">
                <LanguageSelector language={language} onSelect={onSelect} languages={languages} />
                <Editor
                    height="80vh"
                    theme="myCustomTheme"
                    language={language}
                    defaultValue={IDE.code}
                    beforeMount={handleEditorWillMount}
                    onMount={onMount}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
                <button onClick={handleClick}>Save</button>
                <Output editorRef={editorRef} language={language} version={version}/>
            </div>
        </div>
    );
};

export default CodeEditor;
