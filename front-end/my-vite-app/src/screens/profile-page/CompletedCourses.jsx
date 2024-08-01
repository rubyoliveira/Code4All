import ProfileCards from './ProfileCards';
import { useState, useEffect, useRef } from 'react';

function CompletedCourses({ completedCourses }) {
    const containerRef = useRef(null);
    const containerWidth = useContainerWidth(containerRef);
    const cardWidth = 200; // Adjust based on your card width including margins
    const cardsPerPage = Math.floor(containerWidth / cardWidth);
    const [visibleStart, setVisibleStart] = useState(0);

    function useContainerWidth(ref) {
        const [width, setWidth] = useState(0);
        useEffect(() => {
            const handleResize = () => {
                if (ref.current) {
                    setWidth(ref.current.offsetWidth);
                }
            };
            window.addEventListener('resize', handleResize);
            handleResize(); // Initial call
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }, [ref]);
        return width;
    }

    const next = () => {
        setVisibleStart((prev) => Math.min(prev + cardsPerPage, completedCourses.length - cardsPerPage));
    };

    const prev = () => {
        setVisibleStart((prev) => Math.max(prev - cardsPerPage, 0));
    };

    return (
        <div className="completed-courses" ref={containerRef}>
            <h3>Completed Courses:</h3>
            <div className="row-scroll">
                {completedCourses.slice(visibleStart, visibleStart + cardsPerPage).map(card => (
                    <ProfileCards
                        key={card.title}
                        title={card.title}
                        image={card.image}
                    />
                ))}
            </div>
            <div className = "c">
            <button onClick={prev} disabled={visibleStart === 0}>Prev</button>
            <button onClick={next} disabled={visibleStart + cardsPerPage >= completedCourses.length}>Next</button>
            </div>
        </div>
    );
}

export default CompletedCourses;
