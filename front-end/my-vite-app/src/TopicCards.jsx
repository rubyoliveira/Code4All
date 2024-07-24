import { useState, useEffect } from 'react';
import './TopicCards.css';
import ReactMarkdown from 'react-markdown';
import ProfileCards from "./ProfileCards.jsx";

function TopicCards({ title, description, videoURL, recommendations, username }) {

  return (
    <>
        <div className = "topic">
            <div className = "topic-text">
                <h3>{title}</h3>
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>
            <iframe className = "topic-video" title="topic-video" src={videoURL} alt="Selected Video"></iframe>
        </div>
        {recommendations.length > 0 && (
          <div className = "recommendations-topic">
            <div>
              <h3>Congrats! You've finished a course, what's next?</h3>
            </div>
            <div className= "recommendations">
                {recommendations.map (rec => (
                    <ProfileCards
                        key = {rec.title}
                        title = {rec.title}
                        image = {rec.image}
                    ></ProfileCards>
                ))}
            </div>
            </div>
        )}
    </>
  )
}

export default TopicCards
