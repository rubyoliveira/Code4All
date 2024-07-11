import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import TopicCards from './TopicCards.jsx';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import "./Topics.css"

function Topics({username}) {
    const { courseId } = useParams();
    const [topics, setTopics] = useState([]);
    const [modules, setModules] = useState([]);

    useEffect(() => {
        fetchModules();
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

    if (username == null || username == "") {
        return <Navigate to="/" />;
      }

    return (
        <>
            <Header username = {username} />
            <div className="course-module">
                <div className="sidebar">
                    {Array.isArray(modules) ? (
                        modules.map((module) => (
                            <div className = "modules" key={module.id}>
                            <button className= "topic-button" onClick={() => fetchTopics(module.id)}><img src= "https://uploads-ssl.webflow.com/66889847ca0b8f284d54b9ab/66889847ca0b8f284d54b9f2_File%20Icon.svg"></img></button>
                            <h3>
                                {module.title}
                            </h3>
                            </div>
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
                                videoURL = {topic.video}
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