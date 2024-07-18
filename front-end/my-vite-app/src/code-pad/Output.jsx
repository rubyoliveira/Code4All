import { executeCode } from "../constants";
import axios from 'axios';
import {useState, useRef} from "react";
import "./CodePad.css"

const Output = ({ language, editorRef, version }) => {
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    const run = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;
        try {
            setIsLoading(true);
            const response = await executeCode(language, sourceCode, version);
            setOutput(response.run.output.split("\n"));
            setIsError(response.run.stderr ? true : false);
        } catch (error) {
            console.error(error);
            alert(error.message || "Unable to run code");
        } finally {
            setIsLoading(false);
        }
    }
    return (
      <div>
        <button disabled={isLoading} onClick={run} className = "run-code">
          {isLoading ? 'Loading...' : 'Run Code'}
        </button>
        <div style={{ margin: '30px 0' }} color={isError ? "red" : "black"}>
          {output ? output.map((line, i) => <p key={i}>{line}</p>) : 'Click "Run Code" to see the output here'}
        </div>
      </div>
    );
  };

  export default Output
