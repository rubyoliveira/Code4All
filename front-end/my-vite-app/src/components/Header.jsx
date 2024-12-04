import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import './Header.css';
import IdeModal from './ideModal';

function Header({ username }) {
    const profileURL = `/profile/${username}`;
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const openModal = () => {
        setDropdownOpen(true);
    };

    const closeModal = () => {
        setDropdownOpen(false);
    };

    return (
        <div className="header">
            <div className="header-items">
                <Link to="/courses">
                    <img
                        className="logo-dog"
                        src="https://daks2k3a4ib2z.cloudfront.net/667c827c7c186db9a3b13906/667c88e2e51a529772f7aa66_cute-long-haired-dachshund-dog-black-tan-cartoon-vector-illustration_42750-1051%20copy-p-130x130q80.jpeg"
                        loading="lazy"
                        width="74"
                        alt="Logo"
                    />
                </Link>
                <div className="nav-buttons">
                    <div className="dropdown" >
                        <button className="code-playground-button" onClick={openModal}>
                            Code Playground
                        </button>
                        {dropdownOpen && <IdeModal closeModal = {closeModal} username = {username}/>}
                    </div>
                    <Link to="/courses/create">
                        <button className="create-course-button">Create Course</button>
                    </Link>
                    <Link to={profileURL}>
                        <button className="profile-page-button">Profile</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
