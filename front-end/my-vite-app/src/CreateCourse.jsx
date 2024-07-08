import { useState, useEffect } from 'react'
import Footer from "./Footer.jsx"
import Header from "./Header.jsx"
import "./CreateCourse.css"


function CreateCourse() {
    //course info
    const [selectedOption, setSelectedOption] = useState('');
    const [courseTitle, setCourseTitle] = useState('')
    const [description, setDescription] = useState('')
    const [moduleTitle, setModuleTitle] = useState('')
    const [topicTitle, setTopicTitle] = useState('')
    const [topicDescription, setTopicDescription] = useState('')
    const [modules, setModules] = useState([])
    //video
    const [searchVideo, setSearchVideo]= useState([])
    const [video, setVideo] = useState('')
    const [videoURL, setVideoURL] = useState('')
    //photo
    const [photoURL, setPhotoURL] = useState('')
    const [photo, setPhoto] = useState('')
    const [searchPhoto, setSearchPhoto] = useState([])
    const [image, setImage] = useState('')


    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const addModule = () => {
        const newModule = {
            title: moduleTitle,
            topics: []
        };
        setModules([...modules, newModule]);
        setModuleTitle('');
    };

    const addTopicToModule = (moduleIndex) => {
        const newTopic = {
            title: topicTitle,
            description: topicDescription,
            video: videoURL
        };
        const updatedModules = [...modules];
        updatedModules[moduleIndex].topics.push(newTopic);
        setModules(updatedModules);
        setTopicTitle('');
        setTopicDescription('');
        setVideoURL('');
    };


    const handleCreateCourse = (event) => {
        event.preventDefault()

        const courseData = {
            title: courseTitle,
            description: description,
            difficulty: selectedOption,
            image: image,
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
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error creating course:', error);
            // Optionally, inform the user that an error occurred
        });
    };

    const fetchVideo = () => {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${import.meta.env.VITE_YOUTUBE_API_KEY}&q=${video}&type=video&part=snippet&maxResults=9&videoEmbeddable=true`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setSearchVideo(data.items); // Store the entire video objects
            })
            .catch(error => {
                console.error('Error fetching videos:', error);
            });
    };

    const handleSearchVideo = (e) => {
        e.preventDefault();
        setVideo(e.target.value)
    }
    const goSearchVideo = (e) => {
        e.preventDefault();
        fetchVideo();
    }

    const selectVideo = (e, selectedVideoId) => {
        e.preventDefault();
        setVideoURL(`http://www.youtube.com/embed/${selectedVideoId}`)
        setVideo(`http://www.youtube.com/embed/${selectedVideoId}`)
        setSearchVideo([]);
    }

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

  return (
    <>
      <Header/>
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
                        <textarea className = "description-input" placeholder='write a desciption..'onChange = {(event) => setDescription(event.target.value)}></textarea>
                    </div>
                </div>
                {modules.map((module, index) => (
                    <div key={index} className="create-modules">
                        <h4>Module {index + 1}</h4>
                        <p>Title: {module.title}</p>
                        {module.topics.map((topic, topicIndex) => (
                            <div key={topicIndex}>
                                <p>Topic {topicIndex + 1}: {topic.title}</p>
                            </div>
                        ))}
                        <div>
                            <div className = "create-div">
                                <span className = "create-span">Topic Title</span>
                                <input className = "create-input" placeholder='Topic title..' onChange={(e) => setTopicTitle(e.target.value)} />
                            </div>
                            <div className = "create-div">
                                <span className = "create-span">Topic Description</span>
                                <textarea className = "description-input" placeholder='Topic description..' onChange={(e) => setTopicDescription(e.target.value)}></textarea>
                            </div>
                            <div className = "create-div">
                                <span className = "create-span">Search for Video</span>
                                <input className = "create-input"  placeholder='search for video..'  onChange = {handleSearchVideo}></input>
                            </div>
                            <button onClick = {e => goSearchVideo(e)}>Search YouTube</button>
                            <div className="video-results">
                                {searchVideo.map((video, index) => (
                                    <img
                                        key={index}
                                        className="video-search"
                                        alt="Video Thumbnail"
                                        src={video.snippet.thumbnails.default.url}
                                        onClick={(e) => selectVideo(e, video.id.videoId)}
                                    />
                                ))}
                            </div>
                            <div>
                                <h4>Selected Video URL: </h4>
                                <p>{videoURL}</p>
                                <iframe title="Selected Video" src={videoURL} alt="Selected Video"></iframe>
                            </div>
                            <button type="button" onClick={() => addTopicToModule(index)}>Add Topic</button>
                        </div>
                    </div>
                ))}
                <div className = "create-div">
                    <span className = "create-span">Module Title</span>
                    <input className = "create-input" placeholder='Module title..' onChange={(e) => setModuleTitle(e.target.value)} />
                </div>
                <button type="button" onClick={addModule}>Add Module</button>
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
