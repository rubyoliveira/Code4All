import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';

import './Profile.css'

function ProfileCards({title, image, description, fetchProfile}) {

    const deleteBoard = async () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${title}/delete`, {
            method: "DELETE",
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to delete course.');
                });
            }
            return response.json();
        })
        .then(() => {
            alert("successfully deleted course");
            fetchProfile();
        })
        .catch((error) => {
            console.error("Error:", error);
            alert(error.message);
        });
    }


    return (
        <>
        <div className = "profile-cards">
            <img className = "pcards-img" src = {image}/>
            <p>{title}</p>
            <p>{description}</p>
            <button onClick = {deleteBoard}>delete</button>
        </div>
        </>
    );
}

export default ProfileCards;
