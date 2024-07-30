import { useState, useEffect } from 'react';
import { UserContext } from './components/UserContext.js';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Home from './screens/home-page/Home.jsx';
import CoursePage from './screens/course-page/CoursePage.jsx';
import Topics from './screens/module-page/topics/Topics.jsx';
import CreateCourse from './screens/create-page/CreateCourse.jsx';
import Profile from "./screens/profile-page/Profile.jsx";
import CodeEditor from "./screens/code-pad/CodeEditor.jsx"
import Survey from "./screens/survey/Survey.jsx"

function App() {
  const [hash, setHash] = useState('')
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

  const codeURL = `/code-pad/${hash}`


  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<CoursePage username={user?.username} />} />
          <Route path="/courses/create" element={<CreateCourse username={user?.username} />} />
          <Route path="/courses/:courseId" element={<Topics username={user?.username} />} />
          <Route path="/profile/:username" element={<Profile handleSignOut = {handleSignOut} />} />
          <Route path= "/code-pad/:idHash" element = {<CodeEditor username = {user?.username} />}/>
          <Route path = "/survey" element = {<Survey username = {user?.username}/>}/>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
