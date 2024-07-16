import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import CoursePage from './CoursePage.jsx';
import Topics from './Topics.jsx';
import CreateCourse from './CreateCourse.jsx';
import Profile from "./Profile.jsx";
import CodeEditor from "./code-pad/CodeEditor"

function App() {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        return parsedUser;
      }
      return null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  });


  const updateUser = (newUser) => {
    setUser(newUser);
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };


  return (
    <div>
      <CodeEditor />
    </div>
    // <UserContext.Provider value={{ user, updateUser }}>
    //   <BrowserRouter>
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/courses" element={<CoursePage username={user?.username} />} />
    //       <Route path="/courses/create" element={<CreateCourse username={user?.username}  />} />
    //       <Route path="/courses/:courseId" element={<Topics username={user?.username}  />} />
    //       <Route path="/profile/:username" element={<Profile handleSignOut = {handleSignOut} />} />
    //     </Routes>
    //   </BrowserRouter>
    // </UserContext.Provider>
  );
}

export default App;
