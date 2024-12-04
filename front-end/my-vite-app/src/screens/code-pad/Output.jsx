import { executeCode } from "./API";
import {useState, useRef} from "react";
import "./CodePad.css"

const Output = ({ language, editorRef, version, idHash, setTerminate, activeUsers}) => {
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [userData, setUserData] = useState([])

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

    const deleteSession = async () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/${idHash}/delete`, {
          method: "DELETE",
      })
      .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete session');
        }
        console.log('deleted');
        alert('terminated session successfully');
        setTerminate(true);
        return response.json(); // Only parse JSON if needed
    })
      .catch((error) => {
          console.error("Error:", error);
          alert(error.message || 'Error terminating session');
      });
    }


    return (
      <div className = "output">
        <div className = "code-pad-buttons">
          <button disabled={isLoading} onClick={run} className = "run-code">
            {isLoading ? 'Loading...' : 'Run Code'}
          </button>
          <button className = "terminate-session" onClick = {deleteSession}>terminate session</button>
          {/* Display Active Users */}
          <ActiveUsers users={activeUsers} />
        </div>
        <div style={{ margin: '30px 0' }} color={isError ? "red" : "black"}>
          {output ? output.map((line, i) => <p key={i}>{line}</p>) : 'Click "Run Code" to see the output here'}
        </div>
      </div>
    );
  };

  const ActiveUsers = ({ users }) => {
    return (
        <div className="active-users">
            {users.map((user, index) => (
                <div key={index} className="user">
                    <span 
                        className="user-color" 
                        style={{ backgroundColor: user.color }}
                    ></span>
                    <span>{user.name}</span>
                </div>
            ))}
        </div>
    );
};
  export default Output
