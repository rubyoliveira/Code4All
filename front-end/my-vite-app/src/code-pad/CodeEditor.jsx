import React from "react";
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from "y-monaco"
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
    const editorRef = useRef(null);
    const [IDE, setIDE] = useState({code: '//language'})
    const [value, setValue] = useState('');
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState('');
    const saveTimeout = useRef(null)
    const ydocRef = useRef(null)
    const providerRef = useRef(null)
    const prevValueRef = useRef('')


    useEffect(() => {
        fetchLanguages();
        initializeYjs()
        fetchInteractive();
        const intervalId = setInterval(fetchInteractive, 5000);
        return () => {
            clearInterval(intervalId)
            if(providerRef.current){
                providerRef.current.disconnect()
            }
            if(ydocRef.current){
                ydocRef.current.destroy()
            }
        }
    }, []);

    // useEffect(() => {
    //     if(value !== prevValueRef.current){
    //         if(saveTimeout.current){
    //             clearTimeout(saveTimeout.current)
    //         }
    //         saveTimeout.current = setTimeout(() => {
    //             saveCode(value);
    //             // fetchInteractive();
    //             prevValueRef.current = value;
    //         }, 1000);
    //         return () => {
    //             if(saveTimeout.current){
    //                 clearTimeout(saveTimeout.current)
    //             }
    //         }
    //     }
    // }, [value])

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
                    const serverCode = data.code
                    setIDE(data);
                    setValue(serverCode)
                } else {
                    console.error('No code data available');
                }
            })
            .catch(error => console.error('Error fetching IDE:', error));
      };

    const saveCode = () => {
        if(ydocRef.current) {
            const ytext = ydocRef.current.getText('monaco').toString();
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}/save`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ code: ytext }),
            })

        .then(response => response.json())
        .catch(error => console.error('Error saving code:', error));
        }
        // fetchInteractive();
    };

    const initializeYjs = () => {
        const ydoc = new Y.Doc()
        ydocRef.current = ydoc
        const provider = new WebsocketProvider(
          'wss://demos.yjs.dev/ws',
          'monaco-demo-2024/06',
          ydoc
        )

        const ytext = ydoc.getText('monaco')

        providerRef.current = provider;

        if(editorRef.current){
            new MonacoBinding(ytext, editorRef.current.getmodel(), new Set([editorRef.current]), provider.awareness);
        }
    }


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
