import { useState, useEffect } from 'react';
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import StarRating from "../../components/StarRating.jsx";
import { Link } from 'react-router-dom';

function CourseCards({title, description, level, img, likes, username, averageRating, fetchCards}) {
    const [vote, setVote] = useState(likes);
    const [openRating, setOpenRating] = useState(false);

    const displayRating = () => setOpenRating(true);
    const handleCloseRating = () => setOpenRating(false);

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
            alert('Course saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving:', error);
        });
    };

    return (
        <>
            <div className="course">
                <Link to={`/courses/${title}`}>
                    <img className="course-img" src={img} alt="Course"></img>
                </Link>
                <h3>{title}</h3>
                <div className = 'course-description'>
                    <h4>{description}</h4>
                </div>
                <div>
                <p><strong>Level:</strong>  {level}</p>
                <p><strong>Average Difficulty:</strong>  {averageRating ? averageRating.toFixed(1) : 'N/A'}&#11088;</p>
                </div>
                <div className="course-buttons">
                    <button className="save-later" onClick={handleUpvote}>{vote}&#128151;</button>
                    <button className="save-later" onClick={handleSave}>Save for Later</button>
                    {!openRating && <button className="save-later" onClick={displayRating}>Leave a Difficulty Rating</button>}
                </div>
                {openRating && <StarRating closeModal={handleCloseRating} courseId={title} fetchCards={fetchCards}/>}
            </div>
        </>
    )
}

export default CourseCards;
