import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from "./Header.jsx"
import './Profile.css'

function Profile({handleSignOut}) {
    const { username } = useParams();
    const [userData, setUserData] = useState('');
    if (username == null) {
        return <Navigate to="/" replace />;
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

    return (
        <>
        <Header/>
            {userData ? (
                <div className="profile">
                    <img className = "profile-pic" src = {userData.image} alt = "n/a"></img>
                    <h3>Hi, {userData.name}!</h3>
                    <p>{userData.username}</p>
                    <p>{userData.email}</p>
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
