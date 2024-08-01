import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';
import ProfileCards from "./ProfileCards.jsx"
import Created from "./Created.jsx"

import Header from "../../components/Header.jsx"
import './Profile.css'

function Profile({handleSignOut}) {
    const { username } = useParams();
    const [userCourses, setUserCourses] = useState([])
    const [saved, setSaved] = useState([])
    const [userData, setUserData] = useState('');
    const [codingSessions, setCodingSessions] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [completedCourses, setCompletedCourses] = useState([])

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
        fetchUserCourses();
        fetchRecommendations();
        fetchSavedCourses();
        fetchCompletedCourses();
        fetchCodingSessions();
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

    const fetchCompletedCourses = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/completed-courses`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setCompletedCourses(data);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
    };

    const fetchRecommendations = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/recommendations`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setRecommendations(data);
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
    };

    const fetchCodingSessions = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/coding-sessions`, {
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const sessions = data.map(session => `/code-pad/${session.idHash}`);
            setCodingSessions(sessions);
        })
        .catch(error => {
            console.error('Error fetching coding sessions:', error);
        });
    }

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

    const openInNewTab = (idHash) => {
        console.log('clicking')
        window.open(`${window.location.origin}${idHash}`, '_blank')
    }

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
        <Header username = {username}/>
            {userData ? (
                <div className="profile">
                    <div className = "profile-details">
                        <img className = "profile-pic" src = {userData.image} onClick = {fetchDogs} alt = "n/a"></img>
                        <p className = "p-image">click photo for new dog pic</p>
                        <h3 className = "hi-user">Hi, {userData.name}!</h3>
                        <p>{userData.username}</p>
                        <p>{userData.email}</p>
                        <div className = "created-courses">
                            <h4>Courses created by you</h4>
                            {userCourses.map(card => (
                                <Created
                                    key = {card.title}
                                    title ={card.title}
                                    image = {card.image}
                                    fetchProfile = {fetchProfile}
                                    author = {card.author}
                                    user = {userData.username}/>
                                ))}
                        </div>
                        <Link to = "/">
                        <button className = 'logout' onClick = {handleSignOut}> Log Out </button>
                        </Link>
                        {/* <p>{userData.modules}</p> */}
                    </div>
                    <div className = "right-profile">
                        <div className = "middle-profile">
                            <div className = "completed-courses">
                                <h3>Completed Courses:</h3>
                                <div className = "row-scroll">
                                {completedCourses.map(card => (
                                    <ProfileCards
                                    key = {card.title}
                                    title ={card.title}
                                    image = {card.image}
                                    fetchProfile = {fetchProfile}
                                    author = {card.author}
                                    user = {userData.username}/>
                                ))}
                                </div>
                            </div>
                            <div className = "recommended-courses">
                                <h3>Recommended Courses:</h3>
                                {recommendations.map(card => (
                                <ProfileCards
                                    key = {card.title}
                                    title ={card.title}
                                    image = {card.image}
                                    fetchProfile = {fetchProfile}
                                    author = {card.author}
                                    user = {userData.username}/>
                                ))}
                            </div>
                        </div>
                        <div className = "farthest-profile">
                            <div className = "saved-courses">
                                <h3>Saved for Later:</h3>
                                {saved.map(card => (
                                    <ProfileCards
                                    key = {card.title}
                                    title ={card.title}
                                    image = {card.image}
                                    fetchProfile = {fetchProfile}
                                    author = {card.author}
                                    user = {userData.username}/>
                                ))}
                            </div>
                            <div className = "coding-sessions">
                                <h3>Coding Sessions:</h3>
                                {codingSessions.map(code => (
                                    <div key = {code}>
                                        <a onClick={() => openInNewTab(code)}>{code}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No user data available</p>
            )}
        </>
    );
}

export default Profile;
