import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link, Navigate } from 'react-router-dom';

import './Profile.css'

function ProfileCards({title, image}) {


    return (
        <>
        <div className = "profile-cards">
            <Link to = {`/courses/${title}`}>
                <img className ="pcards-img" src = {image}></img>
            </Link>
            <h4>{title}</h4>
        </div>
        </>
    );
}

export default ProfileCards;
