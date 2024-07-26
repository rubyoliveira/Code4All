import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import TopicCards from './TopicCards.jsx';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Modules from "./Modules.jsx"
import { handleRecommendations } from "./recommendation";
import RecommendationCards from "./RecommendationCards.jsx";

import "./Topics.css"

function Topics({username}) {
    const { courseId } = useParams();
    const [topics, setTopics] = useState([]);
    const [modules, setModules] = useState([]);
    const [recommendations, setRecommendations] = useState([])

    useEffect(() => {
        fetchModules()
        if (recommendations.length > 0) {
            handleRecommendations(username, recommendations);
        }
    }, [courseId, username, recommendations]);

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
                            <Modules key = {module.id} id = {module.id} title = {module.title} username = {username} fetchTopics = {fetchTopics} setRecommendations = {setRecommendations}/>
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
                    {recommendations.length > 0 && (
                        <div className = "recommendations-topic">
                            <div>
                            <h3>Congrats! You've finished a course, what's next?</h3>
                            </div>
                            <div className= "recommendations">
                                {recommendations.map (rec => (
                                    <RecommendationCards
                                        key = {rec.title}
                                        title = {rec.title}
                                        image = {rec.image}
                                    ></RecommendationCards>
                                ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Topics;
