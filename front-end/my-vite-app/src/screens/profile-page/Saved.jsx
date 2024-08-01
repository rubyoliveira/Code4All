import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';

import './Profile.css'

function Saved({username}) {
    const [saved, setSaved] = useState([])
    useEffect(() => {
        fetchSavedCourses();
    }, [username]);

    const fetchSavedCourses = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/saved-courses`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setSaved(data);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
        });
    };


    return (
        <>
         <div className = "saved-courses">
            <h3>Saved for Later:</h3>
            {saved.map(card => (
                    <div className = "saved-cards" key = {card.title}>
                        <Link to = {`/courses/${card.title}`}>
                            <img className ="saved-img" src = {card.image}></img>
                        </Link>
                        <h4 className = "saved-title">{card.title}</h4>
                    </div>
            ))}
         </div>
        </>
    );
}


export default Saved;
