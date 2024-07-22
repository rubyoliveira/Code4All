import {useState} from 'react'

function StarRating({courseId, fetchCourseData, closeModal }) {
    const [rating, setRating] = useState(0)

    const handleRating = (rate) => {
        setRating(rate);
        submitRating(rate);
    }

    const submitRating = async (rate) => {
        try{
            await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: rate }),
            });
            fetchCourseData();
        } catch (error){
            console.error('Error submitting rating:', error)
        }
    }

    return (
        <div className = "star-rating">
            <div className = "star-content">
                {[1,2,3,4,5].map(star =>(
                    <button
                        key={star}
                        className = {star <= rating ? 'on' : 'off'}
                        onClick = {() => handleRating(star)}
                    >
                        *
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StarRating;
