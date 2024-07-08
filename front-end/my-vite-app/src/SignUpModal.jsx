import { useState, useContext } from 'react';
import './SignUpModal.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';

const SignUpModal = ({ closeModal }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { updateUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        // Make the signup API request
        const response = await fetch(`http://localhost:3000/create`, {
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

          console.log('Signup successful');

          // Reset form fields
          setUsername('');
          setPassword('');

          // Update the user context
          updateUser(loggedInUser);

          // Navigate to the home page after successful login
          navigate('/courses');
        } else {
          // Handle signup failure case
          alert('Signup failed');
        }
      } catch (error) {
        // Handle any network or API request errors
        alert('Signup failed: ' + error);
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
