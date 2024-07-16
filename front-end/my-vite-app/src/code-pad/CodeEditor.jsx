import {Editor} from "@monaco-editor/react";
import {useState} from "react";
import LanguageSelector from "./LanguageSelector";
import Output from "./Output";
import { STARTER_CODE } from "../constants";

const CodeEditor = () => {
    const editorRef = useRef()
    const [value, setValue] = useState('')
    const [language, setLanguage] = useState('javascript')

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus();
    }

    const onSelect = (language) => {
        setLanguage(language)
        setValue(STARTER_CODE[language])
    }

    return(
        <div>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
                height="75vh"
                theme = "vs-dark"
                language = {language}
                defaultValue="// some comment"
                onMount = {onMount}
                value = {value}
                onChange = {(value) => setValue(value)}
            />
            <Output editorRef = {editorRef} language = {language}/>
        </div>
    )
}
export default CodeEditor
