import { useState } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"


function CourseCards({title, description, level, img}) {

  return (
    <>
        <div className = "course">
            <img className ="course-img" src = {img}></img>
            <h3>{title}</h3>
            <p>{description}</p>
            <p>Level: {level}</p>
            <button className = "save-later">Save for Later</button>
        </div>
    </>
  )
}

export default CourseCards
