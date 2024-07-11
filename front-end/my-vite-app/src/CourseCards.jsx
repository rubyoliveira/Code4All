import { useState } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import { Link } from 'react-router-dom';


function CourseCards({title, description, level, img, likes, username}) {
    const [vote, setVote] = useState(likes);

    const handleUpvote = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${title}`, {
            method: 'PATCH',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to upvote');
            }
            return response.json();
        })
        .then(updatedLike => {
            setVote(updatedLike.likes);
        })
        .catch(error => {
            console.error('Error upvoting:', error);
        });
    };

    const handleSave = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${title}/save`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save');
            }
            return response.json();
        })
        .then(data => {
            console.log('Course saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving:', error);
        });
    };

  return (
    <>
        <div className = "course">
        <Link to = {`/courses/${title}`}>
            <img className ="course-img" src = {img}></img>
        </Link>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>Level: {level}</p>
            <div className = "course-buttons">
                <button className = "save-later" onClick = {handleSave}>Save for Later</button>
                <button className = "likes" onClick = {handleUpvote}>Like Count: {vote}</button>
            </div>
        </div>
    </>
  )
}

export default CourseCards
