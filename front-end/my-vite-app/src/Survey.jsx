import { useState } from 'react';
import { recommendations, fetchCards } from "./recommendation";
import './Survey.css';
import { useNavigate, Link} from 'react-router-dom';
import { UserContext } from './UserContext.js';

const Survey = ({username}) => {
    const [step, setStep] = useState(1);
    const [interest, setInterest] = useState('');
    const [level, setLevel] = useState('');
    const [rating, setRating] = useState('');
    const [hoverRating, setHoverRating] = useState(0)
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [recommendedCourses,  setRecommendedCourses] = useState([]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submitSurvey = (level, rating) => {
        fetchCards()
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching cards:', error))
            setRecommendedCourses(recommendations(courses, level, rating))
        nextStep();
    };

    const handleRecommendations = (recommendations) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/add-recommendation`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newRecommendations: recommendations }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save recommendations');
            }
            return response.json();
        })
        .then(data => {
            alert('Recommendations saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving recommendations:', error);
        });
    };


    const handleLanguageSelection = (language) => {
        setLanguages(prevLanguages => [...prevLanguages, language]);
    };

    return (
      <>
        <div className="signup">
            <div className = "content">
            { step === 1 && <div className = "top-survey">
                <h3>What Brings You to Code4All</h3>
                <div className = "container-survey">
                    <button onClick = {() => setInterest('Learning')}>Learning</button>
                    <button onClick = {() => setInterest('Coding for Free')}>Coding for Free</button>
                    <button onClick = {() => setInterest('For Fun')}>For Fun</button>
                    <button onClick = {() => setInterest('Practicing Skills')}>Practicing Skills</button>
                </div>
            </div>}
            {step === 2 && <div className = "top-survey">
                <h3>What is your Coding Level</h3>
                <div className = "container-survey">
                    <button onClick = {() => setLevel('Beginner')}>Beginner</button>
                    <button onClick = {() => setLevel('Intermediate')}>Intermediate</button>
                    <button onClick = {() => setLevel('Expert')}>Expert</button>
                </div>
            </div>}
            {step === 3 && <div className = "top-survey">
                <h3>What Would you Rate yourself at this Level</h3>
                <div className = "star-rating">
                    <div className = "star-content">
                        {[1,2,3,4,5].map(star =>(
                            <p
                                key={star}
                                className ={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                onClick = {() => setRating(star)}
                                onMouseEnter = {()=> setHoverRating(star)}
                                onMouseLeave = {() => setHoverRating(0)}
                            >
                                ★
                            </p>
                        ))}
                    </div>
                </div>
            </div>}
            {step === 4 && <div className = "top-survey">
                <h3>What Languages are you Interested in</h3>
                <div className = "container-survey">
                    <button onClick = {() => handleLanguageSelection('Python')}>Python</button>
                    <button onClick = {() => handleLanguageSelection('Java')}>Java</button>
                    <button onClick = {() => handleLanguageSelection('JavaScript')}>JavaScript</button>
                    <button onClick = {() => handleLanguageSelection('Ruby')}>Ruby</button>
                    <button onClick = {() => handleLanguageSelection('C')}>C</button>
                </div>
            </div>}
            {step === 5 && <div className = "top-survey">
                <h3>Recommended Courses</h3>
                    {recommendedCourses.map((card, index) => (
                        <div key={index}>
                            <p>Title: {card.title}</p>
                        </div>
                    ))}
            </div>}
            <div className = "bottom-survey">
            <div className = "progress-bar">
                {[1,2,3,4,5].map(dot => (
                    <div key = {dot} className = {`dot ${step >= dot ? 'active' : ''}`}></div>
                ))}
            </div>
                 <div className = "survey-buttons">
                    {step != 1 && step != 5 && <button onClick = {prevStep}>Prev</button>}
                    {step != 4 && step != 5 && <button onClick = {nextStep}>Next</button>}
                    {step === 4 && <button onClick = {() => submitSurvey(level, rating, languages)}>Submit</button>}
                    {step === 5 &&<Link to = "/courses"><button onClick = {() => handleRecommendations(recommendedCourses)}>Go To Home Page</button></Link>}
                </div>
            </div>
            </div>
        </div>
      </>
    );
}

export default Survey;
