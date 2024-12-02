import { useState } from 'react';
import CodeBot from "../../components/CodeBot.jsx";
import ReactMarkdown from 'react-markdown';
import "./CreateCourse.css";

function CreateModules({ modules, setModules, setCurrentStep }) {
    const [moduleTitle, setModuleTitle] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);

    // Video States
    const [searchVideo, setSearchVideo] = useState([]);
    const [video, setVideo] = useState('');
    const [videoURL, setVideoURL] = useState('');

    // Edit State for Topic Description
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(topicDescription);

    // YouTube API Fetching
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
        setVideo(e.target.value);
    };

    const goSearchVideo = (e) => {
        e.preventDefault();
        fetchVideo();
    };

    const selectVideo = (e, selectedVideoId) => {
        e.preventDefault();
        setVideoURL(`https://www.youtube.com/embed/${selectedVideoId}`);
        setVideo(`https://www.youtube.com/embed/${selectedVideoId}`);
        setSearchVideo([]);
    };

    // Module and Topic Management
    const addModule = () => {
        if (!moduleTitle.trim()) {
            alert('Module title cannot be empty.');
            return;
        }

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
        if (!topicTitle.trim()) {
            alert('Topic title cannot be empty.');
            return;
        }
        if (!topicDescription.trim()) {
            alert('Topic description cannot be empty.');
            return;
        }

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

    // Edit Handlers
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setTopicDescription(editDescription);
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setEditDescription(topicDescription);
        setIsEditing(false);
    };

    return (
        <div className="create-page">
            {currentModuleIndex === -1 ? (
                <div className="module-create-page">
                    <h2>Add a New Module</h2>
                    <div className="create-div">
                        <span className="create-span">Module Title</span>
                        <input
                            className="create-input"
                            placeholder='Module title...'
                            value={moduleTitle}
                            onChange={(e) => setModuleTitle(e.target.value)}
                            required
                        />
                    </div>
                    <button onClick={addModule} className="profile-page-button">Add Module</button>
                </div>
            ) : (
                <div className="topics-create-page">
                    <div className="topics-create">
                        <h2>Add Topics to Module: {modules[currentModuleIndex].title}</h2>
                        {modules[currentModuleIndex].topics.map((topic, index) => (
                            <div key={index} className="topic-item">
                                <p><strong>Topic {index + 1}:</strong> {topic.title}</p>
                                <ReactMarkdown>{topic.description}</ReactMarkdown>
                                {topic.video && (
                                    <div className="video-container">
                                        <iframe
                                            title={`Video for ${topic.title}`}
                                            src={topic.video}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="video-selected"
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="create-div">
                            <span className="create-span">Topic Title</span>
                            <input
                                className="create-input"
                                placeholder='Topic title...'
                                value={topicTitle}
                                onChange={(e) => setTopicTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="create-div">
                            <span className="create-span">Topic Description</span>
                            <CodeBot setDescription={setTopicDescription} />
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
                                    <ReactMarkdown>{topicDescription}</ReactMarkdown>
                                    <button type="button" className="editing-button" onClick={handleEditClick}>Edit</button>
                                </div>
                            )}
                        </div>
                        <div className="create-div">
                            <span className="create-span">Search for Video</span>
                            <input
                                className="create-input"
                                placeholder='Search for video...'
                                value={video}
                                onChange={handleSearchVideo}
                                required
                            />
                        </div>
                        <button className='search-youtube' onClick={goSearchVideo}>Search YouTube</button>
                        <div className="video-results">
                            {searchVideo.map((videoItem, index) => (
                                <img
                                    key={index}
                                    className="video-search"
                                    alt="Video Thumbnail"
                                    src={videoItem.snippet.thumbnails.default.url}
                                    onClick={(e) => selectVideo(e, videoItem.id.videoId)}
                                />
                            ))}
                        </div>
                        {videoURL && (
                            <div>
                                <h4>Selected Video:</h4>
                                <iframe
                                    title="Selected Video"
                                    src={videoURL}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="video-selected"
                                ></iframe>
                            </div>
                        )}
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
