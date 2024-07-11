import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import CourseCards from "./CourseCards.jsx"

import Header from "./Header.jsx"
import './Profile.css'

function Profile({handleSignOut}) {
    const { username } = useParams();
    const [userCourses, setUserCourses] = useState([])
    const [saved, setSaved] = useState([])
    const [userData, setUserData] = useState('');
    if (username == null) {
        return <Navigate to="/" />;
    }

    useEffect(() => {
        const fetchProfile = () => {
            fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}`, {
                credentials: 'include'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setUserData(data);
            })
            .catch(error => {
                console.error('Error fetching profile:', error);
            });
        };

        fetchProfile();
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

    const fetchUserCourses = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/created-courses`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setUserCourses(data);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
    };



    return (
        <>
        <Header/>
            {userData ? (
                <div className="profile">
                    <img className = "profile-pic" src = {userData.image} alt = "n/a"></img>
                    <h3>Hi, {userData.name}!</h3>
                    <p>{userData.username}</p>
                    <p>{userData.email}</p>
                    <p>{userData.modules}</p>
                    <div>
                    <button onClick = {fetchUserCourses}>Your Courses</button>
                    <div className = "courses">
                        {userCourses.map(card => (
                            <div className = "profile-cards" key = {card.title}>
                                <img className = "pcards-img" src = {card.image}/>
                                <p>{card.title}</p>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick = {fetchSavedCourses}>Saved For Later</button>
                    <div className = "courses">
                        {saved.map(card => (
                            <div className = "profile-cards" key = {card.title}>
                                <img className = "pcards-img" src = {card.image}/>
                                <p>{card.title}</p>
                                <p>{card.description}</p>
                            </div>
                        ))}
                    </div>
                    </div>
                    <Link to = "/">
                        <button onClick = {handleSignOut}> Log Out </button>
                    </Link>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </>
    );
}

export default Profile;
