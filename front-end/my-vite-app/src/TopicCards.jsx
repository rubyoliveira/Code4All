import { useState, useEffect } from 'react'
import './TopicCards.css'



function TopicCards({title, description, videoURL}) {

  return (
    <>
        <div className = "topic">
            <div className = "topic-text">
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
            <iframe className = "topic-video" title="topic-video" src={videoURL} alt="Selected Video"></iframe>
        </div>
    </>
  )
}

export default TopicCards
