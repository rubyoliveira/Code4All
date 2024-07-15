import { useState, useEffect } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import "./CreateCourse.css"
import CodeBot from "./CodeBot.jsx"
import CreateModules from "./CreateModules.jsx"
import { Navigate} from 'react-router-dom';



function CreateCourse({username}) {
    //course info
    const [selectedOption, setSelectedOption] = useState('');
    const [courseTitle, setCourseTitle] = useState('')
    const [description, setDescription] = useState('')
    const [modules, setModules] = useState([])

    //photo
    const [photoURL, setPhotoURL] = useState('')
    const [photo, setPhoto] = useState('')
    const [searchPhoto, setSearchPhoto] = useState([])
    const [image, setImage] = useState('')

    //post method and associated functions of making the course
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleCreateCourse = (event) => {
        event.preventDefault()
        console.log(username)
        const courseData = {
            title: courseTitle,
            description: description,
            difficulty: selectedOption,
            image: image,
            author: username,
            modules: modules
        };

        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(courseData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setCourseTitle('')
            setDescription('')
            setSelectedOption('')
            setModules([])
            setImage('')
            setPhotoURL('')
            setPhoto('')
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error creating course:', error);
        });
    };

    const fetchPhoto = () => {
        const url = `https://api.unsplash.com/search/photos?query=${photo}&page=1&per_page=6&client_id=${import.meta.env.VITE_PHOTO_API_KEY}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const urls = data.results.map(photo => photo.urls.small);
                setSearchPhoto(urls);
            })
            .catch(error => {
                console.error('Error fetching photos:', error);
            });
    };


    const handleSearchPhoto = (e) => {
        e.preventDefault();
        setPhoto(e.target.value)
      }
      const goSearchPhoto = (e) => {
        e.preventDefault();
        fetchPhoto();
    }

    const selectPhoto = (e, selectedURL) => {
        e.preventDefault();
        setPhotoURL(selectedURL)
        setImage(selectedURL)
        setSearchPhoto([]);
    }

    if (username == null || username == "undefined") {
        return <Navigate to="/" />;
      }

  return (
    <>
      <Header username = {username} />
      <form onSubmit = {handleCreateCourse}>
            <div className= "create-page" >
                <h2>Create a New Course</h2>
                <div className = "create-course">
                    <h4>Course</h4>
                    <div className = "create-div">
                        <span className = "create-span">Course Title</span>
                        <input className = "create-input" placeholder='title..' onChange = {(event) => setCourseTitle(event.target.value)}></input>
                    </div>
                    <div className = "create-div">
                        <span className = "create-span">Cover Image Search</span>
                        <input className = "create-input" placeholder='search for image..' onChange = {handleSearchPhoto}></input>
                    </div>
                    <button onClick = {e => goSearchPhoto(e)}>Search Photos</button>
                    <div className = "photo-results">
                        {searchPhoto.map((url, index) => (
                            <img key={index} className="photo-search" alt="photo" src={url} onClick = {(e) => selectPhoto(e, url)} />
                        ))}
                    </div>
                    <div className="pickedUrl">
                        <h4>Selected Photo URL: </h4>
                        <p>{photoURL}</p>
                        <img type="hidden" src={photoURL} alt="Selected Photo" />
                    </div>
                    <div className = "create-div">
                        <span className = "create-span">Course Difficulty</span>
                        <div className = "dropdown">
                            <select className="create-dropdown" value={selectedOption} onChange={handleSelectChange} >
                                <option value = "">select a difficulty</option>
                                <option value ="Beginner" >Beginner</option>
                                <option value ="Intermediate" >Intermediate</option>
                                <option value ="Expert" >Expert</option>
                            </select>
                        </div>
                    </div>
                    <div className = "create-div">
                        <span className = "create-span">Course Description</span>
                        <CodeBot setDescription = {setDescription}></CodeBot>
                    </div>
                </div>
                <CreateModules modules = {modules} setModules ={setModules}></CreateModules>
            <div>
                <button type="submit" className="create-course">Create Course</button>
            </div>
            </div>
        </form>
      <Footer/>
    </>
  )
}

export default CreateCourse
