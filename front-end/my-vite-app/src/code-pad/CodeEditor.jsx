import {Editor} from "@monaco-editor/react";
import {useState} from "react";
import LanguageSelector from "./LanguageSelector";

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
    }

    return(
        <div>
            <LanguageSelector language={language} onSelect={onSelect} />
            <Editor
                height="75vh"
                theme = "vs-dark"
                defaultLanguage="javascript"
                defaultValue="// some comment"
                onMount = {onMount}
                value = {value}
                onChange = {(value) => setValue(value)}
            />
        </div>
    )
}
export default CodeEditor
