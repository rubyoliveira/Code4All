import { useState, useContext } from 'react';
import './SignUpModal.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import Survey from "./Survey.jsx"

const SignUpModal = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const complete = "light";
    const navigate = useNavigate();

    const { updateUser } = useContext(UserContext);

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email, name, complete}),
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          const loggedInUser = data.user;
          localStorage.setItem('user', JSON.stringify(data.user));
          updateUser(loggedInUser);
          navigate('/survey');
        } else if (response.status === 409) {
          const errorData = await response.json();
          alert(`Signup failed: ${errorData.message}`);
        } else {
          alert('Signup failed: Unexpected error');
        }
      } catch (error) {
        alert('Signup failed: ' + error.message);
      }
    };

    return (
      <>
        <div className="signup">
          <form onSubmit={handleSubmit}>
            <div className="signup-content">
              <button className="close-modal" onClick={closeModal}>&#10006;</button>
              <h2>Make an Account</h2>
              <div className = "input-signup">
                <input className = "pass-user" type="text" value={email} placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className = "input-signup">
                <input className = "pass-user" type="text" value={name} placeholder="Enter Name" onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className = "input-signup">
                <input className = "pass-user" type="text" value={username} placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className = "input-signup">
                <input className = "pass-user" type="password" value={password} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="create-account">Create Account</button>
            </div>
          </form>
        </div>
      </>
    );
}

export default SignUpModal;
