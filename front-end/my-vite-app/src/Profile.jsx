import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import CourseCards from "./CourseCards.jsx"
import ProfileCards from "./ProfileCards.jsx"

import Header from "./Header.jsx"
import './Profile.css'

function Profile({handleSignOut}) {
    const { username } = useParams();
    const [userCourses, setUserCourses] = useState([])
    const [saved, setSaved] = useState([])
    const [userData, setUserData] = useState('');
    const [clickedCreate, setClickCreate] = useState(false)
    const [clickedSaved, setClickSaved] = useState(false)

    if (username == "undefined") {
        return <Navigate to="/" />;
    }


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
    useEffect(() => {
        fetchProfile();
    }, [username]);

    const fetchSavedCourses = () => {
        setClickSaved(true)
        setClickCreate(false)
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
        setClickCreate(true)
        setClickSaved(false)
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

    const fetchDogs = () => {
        const url = `https://dog.ceo/api/breed/dachshund/images/random`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                handleDogPic(data.message)
            })
            .catch(error => {
                console.error('Error fetching photos:', error);
            });
        fetchProfile();
    };

    const handleDogPic = (photo) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/picture`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photo }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to change photo');
            }
            return response.json();
        })
        .then(data => {
            alert("changed succesfully to", data)
        })
        .catch(error => {
            console.error('Error upvoting:', error);
        });
        fetchProfile();
    };



    return (
        <>
        <Header/>
            {userData ? (
                <div className="profile">
                    <img className = "profile-pic" src = {userData.image} alt = "n/a"></img>
                    <button onClick = {fetchDogs}>Fetch Dog Profile Picture</button>
                    <h3>Hi, {userData.name}!</h3>
                    <p>{userData.username}</p>
                    <p>{userData.email}</p>
                    <p>{userData.modules}</p>
                    <div>
                        <button onClick = {fetchUserCourses}>Your Courses</button>
                        <button onClick = {fetchSavedCourses}>Saved For Later</button>
                        {clickedCreate && <div className = "courses">
                            {userCourses.map(card => (
                               <ProfileCards key = {card.title} title ={card.title} description = {card.description} image = {card.image} fetchProfile = {fetchProfile} />
                            ))}
                        </div> }
                        {clickedSaved && <div className = "courses">
                            {saved.map(card => (
                                <ProfileCards key = {card.title} title ={card.title} description = {card.description} image = {card.image} fetchProfile = {fetchProfile} />
                            ))}
                        </div>}
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
