import {Editor} from "@monaco-editor/react";
import {useState, useRef, useEffect} from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { STARTER_CODE } from "../constants";

const CodeEditor = () => {
    const editorRef = useRef()
    const [value, setValue] = useState(STARTER_CODE['javascript'])
    const [language, setLanguage] = useState('javascript')
    const [version, setVersion] = useState('18.15.0')
    const [languages, setLanguages] = useState([])

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


    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus();
    }

    const onSelect = (language) => {
        const selectedLangObj = languages.find(lang => lang.language === language)
        setLanguage(language)
        setVersion(selectedLangObj.version)
        setValue(STARTER_CODE[language])
    }

    return(
        <div>
            <LanguageSelector language={language} onSelect={onSelect} languages = {languages} />
            <Editor
                height="75vh"
                theme = "vs-dark"
                language = {language}
                defaultValue="// some comment"
                onMount = {onMount}
                value = {value}
                onChange = {(value) => setValue(value)}
            />
            <Output editorRef = {editorRef} language = {language} version = {version}/>
        </div>
    )
}
export default CodeEditor
