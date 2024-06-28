import { useState } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import "./CoursePage.css"


function CoursePage() {

  return (
    <>
    <Header/>
    <div className = "coursepage">
    <div className="banner">
    <h2>Courses</h2>
    <p>Welcome to the Course Page. We're thrilled you're here and hope you enjoy learning with us!</p>
    </div>
    <div className = "courses">
        <div className = "course">
            <img className ="course-img" src ="https://daks2k3a4ib2z.cloudfront.net/667cb6d2b964e6f8e8516625/667db211f04010c804430176_2535543-p-130x130q80.png"></img>
            <h3>Intro to Python</h3>
            <p>info here</p>
            <p>level of difficulty</p>
            <button>Save for Later</button>
        </div>
        <div className = "course">
            <img className ="course-img" src = "https://daks2k3a4ib2z.cloudfront.net/667cb6d2b964e6f8e8516625/667dcc41ec78017d908fa375_coding-language-java-system-thin-line-icon-vector-28680151-p-130x130q80.jpeg"></img>
            <h3>Intro to Java</h3>
            <p>info here</p>
            <p>level of difficulty</p>
            <button>Save for Later</button>
        </div>
        <div className = "course">
            <img className ="course-img" src ="https://daks2k3a4ib2z.cloudfront.net/667cb6d2b964e6f8e8516625/667dccbc47d09438a593450f_9118438-p-130x130q80.png"></img>
            <h3>Data Structures</h3>
            <p>info here</p>
            <p>level of difficulty</p>
            <button>Save for Later</button>
        </div>
    </div>
    </div>
    <Footer/>
    </>
  )
}

export default CoursePage
