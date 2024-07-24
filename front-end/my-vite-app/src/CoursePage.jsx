import { useState, useEffect } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import "./CoursePage.css"
import { Navigate} from 'react-router-dom';
import CourseCards from "./CourseCards"


function CoursePage({username}) {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setCards(data);
      })
      .catch(error => {
        console.error('Error fetching cards:', error);
      });
  };

  if (username == "undefined") {
    return <Navigate to="/" />;
  }


  return (
    <>
      <Header username = {username}/>
      <div className = "coursepage">
        <div className="banner">
          <h2>Courses</h2>
          <p>Welcome to the Course Page. We're thrilled you're here and hope you enjoy learning with us!</p>
        </div>
          <div className = "courses">
            {cards.map(card => (
              <CourseCards
                key = {card.title}
                title = {card.title}
                img = {card.image}
                description = {card.description}
                level = {card.difficulty}
                likes = {card.likes}
                username = {username}
                averageRating = {card.avgRating}
                fetchCards= {fetchCards}
              />
            ))}
          </div>
        </div>
      <Footer/>
    </>
  )
}

export default CoursePage
