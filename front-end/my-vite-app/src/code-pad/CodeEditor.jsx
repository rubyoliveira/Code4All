import React from "react";
import {Editor} from "@monaco-editor/react";
import {useState, useRef, useEffect} from "react";
import { useParams, Navigate } from 'react-router-dom'; // Ensure Navigate is imported
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { THEME } from "../constants";
import Copilot from "./Copilot";
import "./CodePad.css";

const CodeEditor = ({username}) => {
    const {idHash} = useParams();
    const editorRef = useRef();
    const [IDE, setIDE] = useState({ code: '//pick a language' })
    const [value, setValue] = useState('//pick a language');
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState('');


    useEffect(() => {
        fetchLanguages();
        fetchInteractive();
        const interval = setInterval(() => {
            saveCode(value)
        }, 10000);
        return () => clearInterval(interval);
    }, []);

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
                setIDE(data);
                setValue(data.code);
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
        .then(data => alert(`Code saved successfully: ${JSON.stringify(data)}`))
        .catch(error => console.error('Error saving code:', error));
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
