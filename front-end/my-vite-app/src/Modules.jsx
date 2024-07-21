import { useState, useEffect } from 'react'



function Modules({title, id, fetchTopics, username}) {
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
    await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/modules/${id}/completed`, {
        method: 'PATCH',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify({username, courseId: id}),
    })
    setButtonStyle('dark');
    fetchTopics(id);
   }

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
