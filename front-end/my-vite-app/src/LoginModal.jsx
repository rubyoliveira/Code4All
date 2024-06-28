import { useState, useEffect } from 'react'
import './LoginModal.css'


const LoginModal = ({closeModal}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [result, setResult] = useState("");

    const handleChangeUsername = (e) => {
        setUsername(e.target.value)
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }



    const handleLogin = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
            }),
          })
          .then(response => {
            if (response.ok) {
              setResult("login success!");
            }
            else {
              setResult("failed to login!");
            }
          })
          .catch(error => {
            setResult("failed to login!");
          });
      }


  return(
 <>
   <div className = "modal-login">
        <form onSubmit={handleLogin}>
            <div className= "modal-content" >
                <button className = "close-modal" onClick = {closeModal}>&#10006;</button>
                <h2>Log In</h2>
                <label htmlFor = "username">Username:</label>
                <input onChange= {handleChangeUsername} value = {username} type = "text" placeholder = "username"></input>
                <input placeholder = "password" onChange={handleChangePassword} value={password}></input>
                <button type= "submit" className = "log in">Log in</button>
            </div>
        </form>
        <div>
            { result && <p>{result}</p>}
        </div>
   </div>
 </>
  );
}

export default LoginModal
