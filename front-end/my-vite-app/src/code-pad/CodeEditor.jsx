import {Editor} from "@monaco-editor/react";
import {useState} from "react";

const CodeEditor = () => {
    const editorRef = useRef()
    const [value, setValue] = useState('')

    const onMount = (editor) => {
        editorRef.current = editor
        editor.focus();
    }

    return(
        <Editor
            height="75vh"
            theme = "vs-dark"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            onMount = {onMount}
            value = {value}
            onChange = {(value) => setValue(value)}
        />
    )
}
export default CodeEditor
