import {Editor} from "@monaco-editor/react";
import {useState, useRef, useEffect} from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { THEME } from "../constants";
import Copilot from "./Copilot"
import "./CodePad.css"


const CodeEditor = ({username}) => {
    const editorRef = useRef()
    const [value, setValue] = useState('//write code')
    const [language, setLanguage] = useState('javascript')
    const [version, setVersion] = useState('18.15.0')
    const [languages, setLanguages] = useState([])
    const [chat, setChat] = useState('')

    useEffect(() => {
        fetchLanguages();
      }, []);

    const fetchLanguages = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setLanguages(data);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
            });
    }

    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('myCustomTheme', THEME);
    };

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus();
    }

    const onSelect = (language) => {
        const selectedLangObj = languages.find(lang => lang.language === language)
        setLanguage(language)
        setVersion(selectedLangObj.version)
    }

    if (username == "undefined") {
        return <Navigate to="/" />;
      }

    return(
        <div>
            <div className = "code-pad">
                <div className = "code-copilot">
                    <Copilot setDescription={setChat} username = {username}/>
                </div>
                <div className = "ide">
                    <LanguageSelector language={language} onSelect={onSelect} languages = {languages} />
                    <Editor
                        height = "80vh"
                        theme = "myCustomTheme"
                        language = {language}
                        defaultValue="// some comment"
                        beforeMount={handleEditorWillMount}
                        onMount = {onMount}
                        value = {value}
                        onChange = {(value) => setValue(value)}
                    />
                    <Output editorRef = {editorRef} language = {language} version = {version}/>
                </div>
            </div>
        </div>
    )
}
export default CodeEditor
