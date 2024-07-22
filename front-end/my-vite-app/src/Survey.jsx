import { useState } from 'react';
import './Survey.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';

const Survey = ({setSurvey}) => {
    const [step, setStep] = useState(1);
    const [interest, setInterest] = useState('');
    const [level, setLevel] = useState('');
    const [rating, setRating] = useState('');
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [recommendedCourses,  setRecommendedCourses] = useState([]);
    const [className, setClassName] = useState('light-button')

    const closeModal = () => {
        setSurvey(false)
    }

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
    const submitSurvey = (level, rating, languages) => {
        fetchCards();
        recommendations(courses, level, rating, languages);
        nextStep();
        console.log(level)
        console.log("recommended", recommendedCourses)
        console.log(rating)
    };
    const fetchCards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            setCourses(data);
            recommendations(data, level, rating, languages);
          })
          .catch(error => {
            console.error('Error fetching cards:', error);
          });
      };

    const recommendations = async (courses, level, rating, languages) => {
        const fetchAverageRating = async (courseId) => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/average-rating`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch average rating: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                return data.averageRating;
            } catch (error) {
                console.error('Error fetching average rating:', error);
                return null;
            }
        };

        const ratings = await Promise.all(courses.map(course => fetchAverageRating(course.title)));

        const coursesWithRatings = courses.map((course, index) => ({
            ...course,
            avgRating: ratings[index]
        }));

        const filteredCourses = coursesWithRatings.filter(course => {
            return course.difficulty === level && course.avgRating >= rating;

        });

        console.log("Filtered Courses:", filteredCourses);

        const sortedCourses = filteredCourses.sort((a, b) => b.avgRating - a.avgRating);
        console.log("Sorted Courses:", sortedCourses);

        setRecommendedCourses(sortedCourses.slice(0, 3));
    };

    const handleLanguageSelection = (language) => {
        setClassName('dark-button')
        setLanguages(prevLanguages => [...prevLanguages, language]);
    };

    return (
      <>
        <div className="signup">
            <div className = "content">
            <p className="close-modal" onClick={closeModal}>&#10006;</p>
            { step === 1 && <div>
                <h3>What Brings You to Code4All</h3>
                <div className = "container">
                    <button onClick = {() => setInterest('Learning')}>Learning</button>
                    <button onClick = {() => setInterest('Coding for Free')}>Coding for Free</button>
                    <button onClick = {() => setInterest('For Fun')}>For Fun</button>
                    <button onClick = {() => setInterest('Practicing Skills')}>Practicing Skills</button>
                </div>
                <div className = "page-buttons">
                    <button onClick = {nextStep}>Next</button>
                </div>
            </div>}
            {step === 2 && <div>
                <h3>What is your Coding Level</h3>
                <div className = "container">
                    <button onClick = {() => setLevel('Beginner')}>Beginner</button>
                    <button onClick = {() => setLevel('Intermediate')}>Intermediate</button>
                    <button onClick = {() => setLevel('Expert')}>Expert</button>
                </div>
                <div className = "page-buttons">
                    <button onClick = {prevStep}>Prev</button>
                    <button onClick = {nextStep}>Next</button>
                </div>
            </div>}
            {step === 3 && <div>
                <h3>What Would you Rate yourself at this Level</h3>
                <div className = "star-rating">
                    <div className = "star-content">
                        {[1,2,3,4,5].map(star =>(
                            <button
                                key={star}
                                className = {star <= rating ? 'on' : 'off'}
                                onClick = {() => setRating(star)}
                            >
                                *
                            </button>
                        ))}
                    </div>
                </div>
                <div className = "page-buttons">
                    <button onClick = {prevStep}>Prev</button>
                    <button onClick = {nextStep}>Next</button>
                </div>
            </div>}
            {step === 4 && <div>
                <h3>What Languages are you Interested in</h3>
                <div className = "container">
                    <button onClick = {() => handleLanguageSelection('Python')}>Python</button>
                    <button onClick = {() => handleLanguageSelection('Java')}>Java</button>
                    <button onClick = {() => handleLanguageSelection('JavaScript')}>JavaScript</button>
                    <button onClick = {() => handleLanguageSelection('Ruby')}>Ruby</button>
                    <button onClick = {() => handleLanguageSelection('C')}>C</button>
                </div>
                <div className = "page-buttons">
                    <button onClick = {prevStep}>Prev</button>
                    <button onClick = {() => submitSurvey(level, rating, languages)}>Submit</button>
                </div>
            </div>}
            {step === 5 && <div>
                <h3>Recommended Courses</h3>
                    {recommendedCourses.map((card, index) => (
                        <div key={index}>
                            <p>Title: {card.title}</p>
                        </div>
                    ))}
            </div>}
            </div>
        </div>
      </>
    );
}

export default Survey;
