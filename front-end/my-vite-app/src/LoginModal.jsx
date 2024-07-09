import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';
import './LoginModal.css';

const LoginModal = ({ closeModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        updateUser(data.user);
        navigate(`/courses`);
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
      setPassword(''); // Clear password for security
    }
  };

  return (
    <>
      <div className="modal-login">
        <form onSubmit={handleLogin}>
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>&#10006;</button>
            <h2>Log In</h2>
            <div className="input-login">
              <input
                className="user-login"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="username"
                required
                aria-label="Username"
              />
            </div>
            <div className="input-login">
              <input
                className="user-login"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                aria-label="Password"
              />
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LoginModal;
