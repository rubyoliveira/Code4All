import { useState, useEffect } from 'react'



function Modules({title, id, fetchTopics, username}) {
    const [buttonStyle, setButtonStyle] = useState('light')

    const fetchCompletion = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${username}/completed`, {
            method: 'PATCH',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upvote');
            }
            return response.json();
        })
        .then(data => {
            setButtonStyle(data.complete);
        })
        .catch(error => {
            console.error('Error upvoting:', error);
        });
    }

    const buttonClick = (moduleId) => {
        fetchCompletion();
        fetchTopics(moduleId);
    }

  return (
    <>
       <div className="modules">
            <button className={buttonStyle} onClick={() => buttonClick(id)}>
                <img src="https://uploads-ssl.webflow.com/66889847ca0b8f284d54b9ab/66889847ca0b8f284d54b9f2_File%20Icon.svg" alt="Module Icon" />
            </button>
            <h3>{title}</h3>
        </div>
    </>
  )
}

export default Modules
