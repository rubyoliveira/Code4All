import { useState, useEffect } from 'react'
import {UserContext} from './UserContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Home.jsx'
import CoursePage from './CoursePage.jsx'
import LoginModal from './LoginModal.jsx'
import SignUpModal from './SignUpModal.jsx'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });
  const updateUser = (newUser) => {
    setUser(newUser);
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);


  return (
    <>
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<CoursePage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  )
}

export default App
