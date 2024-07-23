import { useState, useEffect } from 'react'

function Modules({title, id, fetchTopics, username, setRecommendations}) {
    const [buttonStyle, setButtonStyle] = useState('light')

    useEffect(()=> {
        checkModuleCompletion()
    }, []);

    const checkModuleCompletion = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/modules/${id}/completion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.completedBy && data.completedBy.includes(username)) {
            setButtonStyle('dark');
        }
    };

    const handleModuleClick = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/modules/${id}/completed`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, courseId: id }), // Ensure courseId is used if necessary
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setButtonStyle('dark');
            fetchTopics(id);
            if (data.recommendations) {
                // Assuming you have a state or a way to handle recommendations
                setRecommendations(data.recommendations); // Update recommendations state or handle it as needed
            }
        } catch (error) {
            console.error("Failed to mark module as completed:", error);
        }
    };

  return (
    <>
       <div className="modules">
            <button className={buttonStyle} onClick={handleModuleClick}>
                <img src="https://uploads-ssl.webflow.com/66889847ca0b8f284d54b9ab/66889847ca0b8f284d54b9f2_File%20Icon.svg" alt="Module Icon" />
            </button>
            <h3>{title}</h3>
        </div>
    </>
  )
}

export default Modules
