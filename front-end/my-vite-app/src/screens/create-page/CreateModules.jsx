import { useState } from 'react';
import CodeBot from "../../components/CodeBot.jsx";
import "./CreateCourse.css";

function CreateModules({ modules, setModules, setCurrentStep }) {
    const [moduleTitle, setModuleTitle] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);

    //video
    const [searchVideo, setSearchVideo]= useState([])
    const [video, setVideo] = useState('')
    const [videoURL, setVideoURL] = useState('')

    //youtube api fetching and functions associated
    const fetchVideo = () => {
        const url = `https://www.googleapis.com/youtube/v3/search?key=${import.meta.env.VITE_YOUTUBE_API_KEY}&q=${video}&type=video&part=snippet&maxResults=6&videoEmbeddable=true`;
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

    const addModule = () => {
        const newModule = {
            title: moduleTitle,
            topics: [],
        };
        setModules([...modules, newModule]);
        setModuleTitle('');
        setCurrentModuleIndex(modules.length);
        // Reset topic and video states
        setTopicTitle('');
        setTopicDescription('');
        setVideoURL('');
    };

    const addTopicToModule = () => {
        const newTopic = {
            title: topicTitle,
            description: topicDescription,
            video: videoURL,
        };
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].topics.push(newTopic);
        setModules(updatedModules);
        setTopicTitle('');
        setTopicDescription('');
        setVideoURL('');
    };

    const handleNextModule = (finish = false) => {
        if (finish) {
            setCurrentStep(3);
        } else {
            setCurrentModuleIndex(-1);
        }
    };
    return (
        <div className="create-page">
            {currentModuleIndex === -1 ? (
                <div className="module-create-page">
                    <h2>Add a New Module</h2>
                    <div className="create-div">
                        <span className="create-span">Module Title</span>
                        <input className="create-input" placeholder='Module title..' value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                    </div>
                    <button onClick={addModule} className="profile-page-button">Add Module</button>
                </div>
            ) : (
                <div className="topics-create-page">
                    <div className="topics-create">
                        <h2>Add Topics to Module: {modules[currentModuleIndex].title}</h2>
                        {modules[currentModuleIndex].topics.map((topic, index) => (
                            <div key={index}>
                                <p>Topic {index + 1}: {topic.title}</p>
                            </div>
                        ))}
                        <div className="create-div">
                            <span className="create-span">Topic Title</span>
                            <input className="create-input" placeholder='Topic title..' value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} />
                        </div>
                        <div className="create-div">
                            <span className="create-span">Topic Description</span>
                            <CodeBot setDescription={setTopicDescription}></CodeBot>
                        </div>
                        <div className = "create-div">
                            <span className = "create-span">Search for Video</span>
                            <input className = "create-input"  placeholder='search for video..'  onChange = {handleSearchVideo}></input>
                        </div>
                        <button className = 'search-youtube' onClick = {e => goSearchVideo(e)}>Search YouTube</button>
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
                            <h4>Selected Video: </h4>
                            <iframe title="Selected Video" src={videoURL} alt="Selected Video" className = "video-selected"></iframe>
                        </div>
                        <button onClick={addTopicToModule} className="add-topic">Add Topic</button>
                        <button onClick={() => handleNextModule(false)} className="profile-page-button">Add Another Module</button>
                        <div>
                            <button onClick={() => handleNextModule(true)} className="finish-button">Finish and Review Course</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateModules;
