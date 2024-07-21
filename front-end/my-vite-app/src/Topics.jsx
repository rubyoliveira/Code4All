import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import TopicCards from './TopicCards.jsx';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Modules from "./Modules.jsx"
import "./Topics.css"

function Topics({username}) {
    const { courseId } = useParams();
    const [topics, setTopics] = useState([]);
    const [modules, setModules] = useState([]);
    const [courseCompleted, setCourseCompleted] = useState(false)

    useEffect(() => {
        fetchModules()
    }, [courseId]);

    const fetchModules = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setModules(data);
            })
            .catch(error => {
                console.error('Error fetching modules:', error);
            });
    };

    const fetchTopics = (moduleId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/${moduleId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setTopics(data);
            })
            .catch(error => {
                console.error('Error fetching topics:', error);
            });
    };

    // const checkCourseCompletion = async () => {
    //     const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/completed-courses`)
    //     const data = await response.json();
    //     const completedCourses = data.completedCourses.map(course => course.title);
    //     if(completedCourses.includes(courseId)){
    //         setCourseCompleted(true);
    //     }
    // }

    if (username === "undefined") {
        return <Navigate to="/" />;
    }
    return (
        <>
            <Header username={username} />
            <div className="course-module">
                <div className="sidebar">
                    {Array.isArray(modules) ? (
                        modules.map((module) => (
                            <Modules key = {module.id} id = {module.id} title = {module.title} username = {username} fetchTopics = {fetchTopics}/>
                        ))
                    ) : (
                        <p>No modules available</p>
                    )}
                </div>
                <div className="topics-list">
                    {Array.isArray(topics) ? (
                        topics.map((topic) => (
                            <TopicCards
                                key={topic.id}
                                title={topic.title}
                                description={topic.description}
                                videoURL={topic.video}
                            />
                        ))
                    ) : (
                        <p>No topics available</p>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Topics;
