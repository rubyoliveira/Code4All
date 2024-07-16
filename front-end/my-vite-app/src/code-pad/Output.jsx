import { executeCode } from "../constants";
import {useState, useRef} from "react";

const Output = ({language, editorRef}) => {
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const run = async () => {
        const sourceCode = editorRef.current.getValue();
        if(!sourceCode) return;
        try {
            setIsLoading(true);
            const { run: result } = await executeCode(language, sourceCode);
            setOutput(result.output.split("\n"));
            result.stderr ? setIsError(true) : setIsError(false);
          } catch (error) {
            console.error(error);
            alert(error.message || "Unable to run code")
          } finally {
            setIsLoading(false);
          }
    }

    return(
        <div>
            <button isLoading={isLoading} onClick={run}>Run Code</button>
            {isLoading ? (
                <p style={{ margin: '30px 0' }}>Loading...</p>
            ) : (
                <div style={{ margin: '30px 0' }} color={isError ? "red.400" : ""}>
                    {output
                    ? output.map((line, i) => <p key={i}>{line}</p>)
                    : 'Click "Run Code" to see the output here'}
                </div>
            )}
        </div>
    )
}
export default Output
