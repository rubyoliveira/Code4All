import { useState, useEffect } from 'react';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import StarRating from "./StarRating.jsx";
import { Link } from 'react-router-dom';

function CourseCards({title, description, level, img, likes, username}) {
    const [vote, setVote] = useState(likes);
    const [openRating, setOpenRating] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        fetchAverageRating(title);
      }, [title]);

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

    const fetchAverageRating = async (courseId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/average-rating`);
            if (!response.ok) {
                throw new Error(`Failed to fetch average rating: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setAverageRating(data.averageRating);
        } catch (error) {
            console.error('Error fetching average rating:', error);
        }
    }

    return (
        <>
            <div className="course">
                <Link to={`/courses/${title}`}>
                    <img className="course-img" src={img} alt="Course"></img>
                </Link>
                <h3>{title}</h3>
                <p>{description}</p>
                <div>
                <p><strong>Level:</strong>  {level}</p>
                <p><strong>Average Difficulty:</strong> {averageRating.toFixed(1)}&#11088;</p>
                </div>
                <div className="course-buttons">
                    <button className="save-later" onClick={handleUpvote}>{vote}&#128151;</button>
                    <button className="save-later" onClick={handleSave}>Save for Later</button>
                    {!openRating && <button className="save-later" onClick={displayRating}>Leave a Difficulty Rating</button>}
                </div>
                {openRating && <StarRating closeModal={handleCloseRating} courseId={title} fetchCourseData={() => fetchAverageRating(title)}/>}
            </div>
        </>
    )
}

export default CourseCards;
