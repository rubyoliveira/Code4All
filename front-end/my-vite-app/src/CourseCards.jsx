import { useState } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import { Link } from 'react-router-dom';


function CourseCards({title, description, level, img, likes}) {

  return (
    <>
    <Link to = {`/courses/${title}`}>
        <div className = "course">
            <img className ="course-img" src = {img}></img>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>Level: {level}</p>
            <div className = "course-buttons">
                <button className = "save-later">Save for Later</button>
                <button className = "likes">Like Count: {likes}</button>
            </div>
        </div>
    </Link>
    </>
  )
}

export default CourseCards
