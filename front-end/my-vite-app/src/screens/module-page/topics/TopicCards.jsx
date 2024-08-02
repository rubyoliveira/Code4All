import { useEffect, useState } from 'react';
import './Topics.css';
import ReactMarkdown from 'react-markdown';

function TopicCards({ topicId, title, description, videoURL, canEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(description);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
      fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/editTopics/${topicId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ description: editDescription }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setIsEditing(false);
        return response.json();
      })
      .catch(error => {
        console.error('Error saving code:', error);
        console.error('Response status:', error.response?.status);
        console.error('Response body:', error.response?.data);
      });
    };

    useEffect(() => {
      if (window.YT) {
          createPlayer();
      } else {
          const tag = document.createElement('script');
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
          window.onYouTubeIframeAPIReady = createPlayer;
      }
  }, []);

  const createPlayer = () => {
    new YT.Player('player', {
        videoId: videoURL,
        events: {
            'onReady': onPlayerReady,
        }
    });
};

  const onPlayerReady = (event) => {
      const player = event.target;
      const iframe = document.getElementById('player');
      document.getElementById('fullscreen-btn').addEventListener('click', () => {
          playFullscreen(player, iframe);
      });
  };

  const playFullscreen = (player, iframe) => {
      player.playVideo();
      const requestFullScreen = iframe.requestFullscreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullscreen || iframe.msRequestFullscreen;
      if (requestFullScreen) {
          requestFullScreen.call(iframe);
      }
  };

    return (
      <>
           <>
            <div className="topic">
                <div className="topic-text">
                    <h3>{title}</h3>
                    {isEditing ? (
                       <textarea className = "editing-box" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    ) : (
                        <ReactMarkdown>{editDescription}</ReactMarkdown>
                    )}
                    {canEdit && (
                      isEditing ? (
                        <button className = "editing-button"  onClick={handleSaveClick}>Save</button>
                      ) : (
                        <button className = "editing-button" onClick={handleEditClick}>Edit</button>
                      )
                    )}
                </div>
                <iframe id="player" className="topic-video" title="topic-video" src={videoURL} allowFullScreen></iframe>
            </div>
        </>
      </>
  );
}

export default TopicCards;
