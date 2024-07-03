import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopicCards from './TopicCards.jsx';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

function Topics() {
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

    return (
        <>
            <Header />
            <div className="topic">
                <Link to='/courses'><button className="home-button">Go Home</button></Link>
                <div className="sidebar">
                    {Array.isArray(modules) ? (
                        modules.map((module) => (
                            <button key={module.id} onClick={() => fetchTopics(module.id)}>
                                {module.title}
                            </button>
                        ))
                    ) : (
                        <p>No modules available</p>
                    )}
                </div>
                <div className="topics-list">
                    {Array.isArray(topics) ? (
                        topics.map((topic) => (
                            <TopicCards
                                key={topic.title}
                                title={topic.title}
                                description={topic.description}
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
