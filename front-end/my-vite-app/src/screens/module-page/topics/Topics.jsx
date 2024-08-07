import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import TopicCards from './TopicCards.jsx';
import Header from "../../../components/Header.jsx";
import Modules from "../Modules.jsx";
import { handleRecommendations } from "../../survey/recommendation.js";
import RecommendationCards from "../RecommendationCards.jsx";
import "./Topics.css";

function Topics({ username }) {
    const { courseId } = useParams();
    const [topics, setTopics] = useState([]);
    const [modules, setModules] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [author, setAuthor] = useState("");

    useEffect(() => {
        fetchModules();
        fetchCards();
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

      const fetchCards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            const course = data.find(course => course.title === courseId);
            if (course) {
              setAuthor(course.author); // Set the author username
            } else {
              console.error(`Course not found with ID ${courseId}`);
            }
          })
          .catch(error => {
            console.error('Error fetching cards:', error);
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
                            <Modules key={module.id} id={module.id} title={module.title} username={username} fetchTopics={fetchTopics} setRecommendations={setRecommendations} />
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
                                topicId = {topic.id}
                                title={topic.title}
                                description={topic.description}
                                videoURL={topic.video}
                                canEdit={username === author}
                            />
                        ))
                    ) : (
                        <p>No topics available</p>
                    )}
                    {recommendations.length > 0 && (
                        <div className="recommendations-topic">
                            <div>
                                <h3>Congrats! You've finished a course, what's next?</h3>
                            </div>
                            <div className="recommendations">
                                {recommendations.map(rec => (
                                    <RecommendationCards
                                        key={rec.title}
                                        title={rec.title}
                                        image={rec.image}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Topics;
