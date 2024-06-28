import { useState, useEffect } from 'react'
import './SignUpModal.css'


const SignUpModal = ({closeModal}) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState("");

    const handleChangeName = (e) => {
        setName(e.target.value)
    }
    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
    }
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }


    const handleSignUp = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                email,
                username,
                password,
            })
        })
            .then(response => {
                console.log(response)
                if (response.ok) {
                  setResult("create success!");
                }
                else {
                  setResult("failed to create!");
                }
              })
              .catch(error => {
                setResult("failed to create!");
              });
    }

  return(
 <>
   <div className = "signup">
        <form onSubmit={handleSignUp}>
            <div className= "signup-content" >
                <button className = "close-modal" onClick = {closeModal}>&#10006;</button>
                <h2>Make an Account</h2>
                <input type="text" value = {name} placeholder="Enter Name" onChange={handleChangeName}></input>
                <input type="text" value = {email} placeholder="Enter Email" onChange= {handleChangeEmail}></input>
                <input type="text" value = {username} placeholder="Enter Username" onChange = {handleChangeUsername}></input>
                <input type="text" value = {password} placeholder="Enter Password" onChange = {handleChangePassword}></input>
                <button type= "submit" className = "create-account">Create Account</button>
            </div>
        </form>
        <div>
        { result && <p>{result}</p>}
      </div>
   </div>
 </>
  );
}

export default SignUpModal
