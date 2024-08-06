import React from "react";
import {Editor} from "@monaco-editor/react";
import {useState, useRef, useEffect} from "react";
import { useParams, Navigate } from 'react-router-dom';
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { THEME } from "./constants";
import Copilot from "./Copilot";
import "./CodePad.css";

const CodeEditor = ({username}) => {
    const {idHash} = useParams();
    const editorRef = useRef();
    const [terminate, setTerminate] = useState(false);
    const [IDE, setIDE] = useState({ code: '//pick a language' })
    const [value, setValue] = useState('//pick a language');
    const [language, setLanguage] = useState('');
    const [version, setVersion] = useState('');
    const [languages, setLanguages] = useState([]);
    const [chat, setChat] = useState('');
    const [openAI, setOpenAI] = useState(false)
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
                prevValueRef.current = value;
            }, 5000);
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

    const getAI = () => {setOpenAI(true)}
    const closeAI = () => {setOpenAI(false)}

    const closeTab = () => {
        window.opener = null;
        window.open("", "_self");
        window.close();
      };


    return (
        <div className = "code">
            {terminate && <div className = "deleted-alert">
                <div className = "terminate-modal">
                <p>course sucessfully deleted, <a onClick = {closeTab}>close this tab</a></p>
                </div>
            </div>}
            <div className="code-pad">
                <div className="code-copilot">
                    <Copilot setDescription={setChat} username={username} closeAI = {closeAI}/>
                </div>
                <div className="ide">
                    <LanguageSelector language={language} onSelect={onSelect} languages={languages} />
                    <div className = 'code-box'>
                    <Editor
                        height="75vh"
                        theme="myCustomTheme"
                        className = "code-box"
                        language={language}
                        defaultValue={IDE.code}
                        beforeMount={handleEditorWillMount}
                        onMount={onMount}
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                    </div>
                    <Output editorRef={editorRef} language={language} version={version} idHash= {idHash} setTerminate = {setTerminate}/>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor;
