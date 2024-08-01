import React from "react"
import { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Header.css'


function Header({username}) {
    const profileURL = `/profile/${username}`

    const openInNewTab = async () => {
        const code = "//code below";
        const users = [];
        const creator = username;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/code-pad/create-ide`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({code, users, creator})
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            // setHash(data);
            const {idHash} = data;
            window.open(`${window.location.origin}/code-pad/${idHash}`, '_blank');
        } catch (error) {
            console.error("Failed to create an IDE session", error);
        }
    };


  return (
    <>
        <div className = "header">
            <div className = "header-items">
                <Link to = "/courses">
                    <img className = "logo-dog" src = "https://daks2k3a4ib2z.cloudfront.net/667c827c7c186db9a3b13906/667c88e2e51a529772f7aa66_cute-long-haired-dachshund-dog-black-tan-cartoon-vector-illustration_42750-1051%20copy-p-130x130q80.jpeg" loading= "lazy" width= "74" alt =""></img>
                </Link>
                <div className = "nav-buttons">
                    <div>
                        <button className="code-playground-button" onClick={openInNewTab}>Code Playground</button>
                    </div>
                    <Link to = "/courses/create">
                        <button className="create-course-button" >Create Course</button>
                    </Link>
                    <Link to = {profileURL}>
                        <button className="profile-page-button">Profile</button>
                    </Link>
                </div>
            </div>
        </div>
    </>
  )
}

export default Header
