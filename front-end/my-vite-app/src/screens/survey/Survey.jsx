import React, { useState, useEffect } from 'react';
import { recommendations, fetchCards, handleRecommendations} from "./recommendation.js";
import './Survey.css';
import { useNavigate, Link} from 'react-router-dom';
import { UserContext } from '../../components/UserContext.js';
import { surveyConfig } from './survey-config.js'

const Survey = ({username}) => {
    const [step, setStep] = useState(1);
    const [interest, setInterest] = useState('');
    const [level, setLevel] = useState('');
    const [rating, setRating] = useState('');
    const [hoverRating, setHoverRating] = useState(0)
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);
    const [recommendedCourses,  setRecommendedCourses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const handlePageChange = (event) => {
            if(event.key === 'ArrowRight' && step !== 4 && step !== 5){
                nextStep();
            }
            else if (event.key === 'ArrowLeft' && step !== 1 && step !== 5) {
                prevStep();
            }
            else if (event.key === "Enter" && (step === 4 || step === 5)) {
                if(step === 4){submitSurvey(level, rating, languages);}
                else if (step === 5){
                    saveRecommendations();
                    navigate('/courses');
                }
            }
        }
        document.addEventListener('keydown', handlePageChange);
        return () => {
          document.removeEventListener('keydown', handlePageChange);
        };
    }, [step, level, rating, languages]);



    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const saveRecommendations = () => {
        handleRecommendations(username, recommendedCourses);
    };

    const submitSurvey = async (level, rating) => {
        try {
            const data = await fetchCards();
            setCourses(data);
            const recommendedCourses = await recommendations(data, level, rating);
            setRecommendedCourses(recommendedCourses);
            nextStep();
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    };

    const handleLanguageSelection = (language) => {
        setLanguages(prevLanguages => [...prevLanguages, language]);
    };

    return (
      <>
        <div className="signup">
            <div className = "content">
            {Object.keys(surveyConfig).map((stepKey) => {
                // Extract the numeric part from stepKey 
                const stepNumber = parseInt(stepKey.replace(/[^\d]/g, ''), 10);
                const currStep = surveyConfig[stepKey];
                return (
                    <div key={stepKey} style={{ display: step === stepNumber ? 'block' : 'none' }}>
                        <h2>{currStep.heading}</h2>
                        <div className = "container-survey">
                        {currStep.options.map((option, index) => (
                            <React.Fragment key={index}>
                                {step === 1 && <button onClick={() => setInterest(option)} className={interest === option ? 'selected' : ''}>{option}</button>}
                                {step === 2 && <button onClick={() => setLevel(option)} className={level === option ? 'selected' : ''}>{option}</button>}
                                <div className = "star-content">
                                    {step === 3 && <p className={`star ${option <= (hoverRating || rating) ? 'filled' : ''}`} onClick={() => setRating(option)} onMouseEnter={() => setHoverRating(option)} onMouseLeave={() => setHoverRating(0)}>★</p>}
                                </div>
                                {step === 4 && <button onClick={() => handleLanguageSelection(option)} className={languages.includes(option) ? 'selected' : ''}>{option}</button>}
                            </React.Fragment>
                        ))}
                        </div>
                    </div>
                );
            })}
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
                    {step === 5 &&<Link to = "/courses"><button onClick = {saveRecommendations}>Go To Home Page</button></Link>}
                </div>
            </div>
            </div>
        </div>
      </>
    );
}

export default Survey;
