import { useState, useContext } from 'react';
import './Survey.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext.js';

const Survey = ({closeModal}) => {
    const [step, setStep] = useState(1)
    const [interest, setInterest] = useState('')
    const [level, setLevel] = useState('')
    const [rating, setRating] = useState('')
    const [languages, setLanguages] = useState('')

    const nextStep = () => setStep(step+1)
    const prevStep = () => setStep(step-1)

    const recomendations = (courses, level, rating, languages) => {
        
    }


    return (
      <>
        <div className="signup">
            <div className = "content">
            <button className="close-modal" onClick={closeModal}>&#10006;</button>
            { step === 1 && <div>
                <h2>What Brings You to Code4All</h2>
                <button onClick = {() => setInterest('Learning')}>Learning</button>
                <button onClick = {() => setInterest('Coding for Free')}>Coding for Free</button>
                <button onClick = {() => setInterest('For Fun')}>For Fun</button>
                <button onClick = {() => setInterest('Practicing Skills')}>Practicing Skills</button>
                <div className = "page-buttons">
                    <button onClick = {nextStep}>Next</button>
                </div>
            </div>}
            {step === 2 && <div>
                <h2>What is your Coding Level</h2>
                <button onClick = {() => setLevel('Beginner')}>Beginner</button>
                <button onClick = {() => setLevel('Intermediate')}>Intermediate</button>
                <button onClick = {() => setLevel('Expert')}>Expert</button>
                <div className = "page-buttons">
                    <button onClick = {prevStep}>Prev</button>
                    <button onClick = {nextStep}>Next</button>
                </div>
            </div>}
            {step === 3 && <div>
                <h2>What Would you Rate yourself at this Level</h2>
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
                <h2>What Languages are you Interested in</h2>
                <button onClick = {() => setLanguages('Python')}>Python</button>
                <button onClick = {() => setLanguages('Java')}>Java</button>
                <button onClick = {() => setLanguages('JavaScript')}>JavaScript</button>
                <button onClick = {() => setLanguages('Ruby')}>Ruby</button>
                <button onClick = {() => setLanguages('C')}>C</button>
                <div className = "page-buttons">
                    <button onClick = {prevStep}>Prev</button>
                    <button>Submit</button>
                </div>
            </div>}
            </div>
        </div>
      </>
    );
}

export default Survey;
