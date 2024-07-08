import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import './LoginModal.css'


const LoginModal = ({closeModal}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const loggedInUser = data.user;

        updateUser(loggedInUser);
        navigate('/courses');
      } else {
        const errorData = await response.json(); // Assuming the server sends a JSON response with error details
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };


  return(
 <>
   <div className = "modal-login">
        <form onSubmit={handleLogin}>
            <div className= "modal-content" >
                <button className = "close-modal" onClick = {closeModal}>&#10006;</button>
                <h2>Log In</h2>
                <div className = "input-login">
                  <input className = "user-login" onChange= {(e) => setUsername(e.target.value)} value = {username} type = "text" placeholder = "username" required></input>
                </div>
                <div className = "input-login">
                  <input className = "user-login" type = "password" placeholder = "password" onChange={(e) => setPassword(e.target.value)} value={password} required></input>
                </div>
                <button type= "submit" className = "login-button">Log in</button>
            </div>
        </form>
   </div>
 </>
  );
}

export default LoginModal
