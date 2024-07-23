import {useState} from 'react'

function StarRating({courseId, fetchCards, closeModal }) {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    const handleRating = (rate) => {
        setRating(rate);
        submitRating(rate);
        closeModal();
    }

    const submitRating = async (rate) => {
        try{
            await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: rate}),
            });
            fetchCards();
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
                    className ={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick = {() => handleRating(star)}
                    onMouseEnter = {()=> setHoverRating(star)}
                    onMouseLeave = {() => setHoverRating(0)}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StarRating;
