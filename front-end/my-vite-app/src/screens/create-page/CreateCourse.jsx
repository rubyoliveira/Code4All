import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Footer from "../../components/Footer.jsx";
import Header from "../../components/Header.jsx";
import "./CreateCourse.css";
import CodeBot from "../../components/CodeBot.jsx";
import CreateModules from "./CreateModules.jsx";
import { Navigate, Link, useNavigate } from 'react-router-dom';
import ReviewCourse from "./ReviewCourse"

function CreateCourse({ username }) {
    // Course info
    const [selectedOption, setSelectedOption] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    // Photo
    const [photoURL, setPhotoURL] = useState('');
    const [photo, setPhoto] = useState('');
    const [searchPhoto, setSearchPhoto] = useState([]);
    const [image, setImage] = useState('');

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(description);

    const navigate = useNavigate();

    useEffect(() => {
        // Synchronize editDescription with description when description changes
        setEditDescription(description);
    }, [description]);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCreateCourse = (event) => {
        event.preventDefault();
    
        const courseData = {
            title: courseTitle,
            description: description,
            difficulty: selectedOption,
            image: image,
            author: username,
            userId: [], 
            modules: modules
        };
    
        console.log("Course Data:", courseData); // Debugging line
    
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Reset form fields
            setCourseTitle('');
            setDescription('');
            setSelectedOption('');
            setModules([]);
            setImage('');
            setPhotoURL('');
            setPhoto('');
            return response.json();
        })
        .then(data => {
            alert("Course created successfully");
            console.log("Created Course:", data);
            navigate('/courses'); // Redirect after successful creation
        })
        .catch(error => {
            console.error('Error creating course:', error);
            alert(`Error creating course: ${error.message}`);
        });
    };
    

    const fetchPhoto = () => {
        const url = `https://api.unsplash.com/search/photos?query=${photo}&page=1&per_page=6&client_id=${import.meta.env.VITE_PHOTO_API_KEY}`;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                const urls = data.results.map((photo) => photo.urls.small);
                setSearchPhoto(urls);
            })
            .catch((error) => {
                console.error('Error fetching photos:', error);
            });
    };

    const handleSearchPhoto = (e) => {
        setPhoto(e.target.value);
    };

    const goSearchPhoto = (e) => {
        e.preventDefault();
        fetchPhoto();
    };

    const selectPhoto = (e, selectedURL) => {
        e.preventDefault();
        setPhotoURL(selectedURL);
        setImage(selectedURL);
        setSearchPhoto([]);
    };

    if (username === "undefined") {
        return <Navigate to="/" />;
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setDescription(editDescription);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditDescription(description);
        setIsEditing(false);
    };

    return (
        <>
            <Header username={username} />
            {currentStep === 1 && (
                <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }}>
                    <div className="create-page">
                        <div className="create-box">
                            <h2>Create a New Course</h2>
                            <div className="create-course">
                                <div className="create-div">
                                    <span className="create-span">Course Title</span>
                                    <input
                                        className="create-input"
                                        placeholder='Title...'
                                        value={courseTitle}
                                        onChange={(event) => setCourseTitle(event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="create-div">
                                    <span className="create-span">Cover Image Search</span>
                                    <input
                                        className="create-input"
                                        placeholder='Search for image...'
                                        value={photo}
                                        onChange={handleSearchPhoto}
                                    />
                                </div>
                                <button onClick={goSearchPhoto} className="search-unsplash">Search Photos</button>
                                <div className="photo-results">
                                    {searchPhoto.map((url, index) => (
                                        <img
                                            key={index}
                                            className="photo-search"
                                            alt="Search Result"
                                            src={url}
                                            onClick={(e) => selectPhoto(e, url)}
                                        />
                                    ))}
                                </div>
                                {photoURL && (
                                    <div className="pickedUrl">
                                        <h4>Selected Photo:</h4>
                                        <img src={photoURL} alt="Selected" />
                                    </div>
                                )}
                                <div className="create-div">
                                    <span className="create-span">Course Difficulty</span>
                                    <div className="dropdown">
                                        <select
                                            className="create-dropdown"
                                            value={selectedOption}
                                            onChange={handleSelectChange}
                                            required
                                        >
                                            <option value="">Select a difficulty</option>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="create-div">
                                    <span className="create-span">Course Description</span>
                                    <CodeBot setDescription={setDescription} />
                                    {isEditing ? (
                                        <div>
                                            <textarea
                                                className="editing-box"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                required
                                            />
                                            <div className="button-group">
                                                <button type="button" className="editing-button" onClick={handleSaveClick}>Save</button>
                                                <button type="button" className="editing-button" onClick={handleCancelClick}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <ReactMarkdown>{description}</ReactMarkdown>
                                            <button type="button" className="editing-button" onClick={handleEditClick}>Edit</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="profile-page-button">Next: Add Modules</button>
                        </div>
                    </div>
                </form>
            )}
            {currentStep === 2 && (
                <CreateModules modules={modules} setModules={setModules} setCurrentStep={setCurrentStep} />
            )}
            {currentStep === 3 && (
                <div className="create-page">
                    <div className="review-page">
                        <h2>Review and Submit Your Course</h2>
                        <ReviewCourse
                            courseTitle={courseTitle}
                            description={description}
                            difficulty={selectedOption}
                            image={image}
                            modules={modules}
                        />
                        <button onClick={handleCreateCourse} className="create-button">Submit Course</button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default CreateCourse;