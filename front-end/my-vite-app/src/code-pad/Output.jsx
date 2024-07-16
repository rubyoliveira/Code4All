

const Output = ({language, editorRef}) => {

    const run = async () => {
        const sourceCode = editorRef.current.getValue();
        if(!sourceCode) return;
        try{

        } catch(error){
            
        }
    }

    return(
        <div>
            <button>Run Code</button>
        </div>
    )
}
e
export default Output
