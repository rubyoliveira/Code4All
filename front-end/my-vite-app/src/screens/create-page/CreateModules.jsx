import { useState, useEffect } from 'react'
import CodeBot from "../../components/CodeBot.jsx"

function CreateModules ({modules, setModules}) {
    const [moduleTitle, setModuleTitle] = useState('')
    const [topicTitle, setTopicTitle] = useState('')
    const [topicDescription, setTopicDescription] = useState('')
    //video
    const [searchVideo, setSearchVideo]= useState([])
    const [video, setVideo] = useState('')
    const [videoURL, setVideoURL] = useState('')

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

    //youtube api fetching and functions associated
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

    return(
        <div>
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
                    <CodeBot setDescription = {setTopicDescription}></CodeBot>
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
    </div>
    )
}

export default CreateModules
