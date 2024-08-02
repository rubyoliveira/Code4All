import { useEffect, useState } from 'react';
import './Topics.css';
import ReactMarkdown from 'react-markdown';

function TopicCards({ title, description, videoURL }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState(description);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        // Make API call to save edited description
        fetch(`/api/topics/${topicId}/edit`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: editDescription })
        })
            .then(response => response.json())
            .then(data => {
                setIsEditing(false);
                setEditDescription(data.description);
            })
            .catch(error => {
                console.error('Error saving description:', error);
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
                        <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                    ) : (
                        <ReactMarkdown>{description}</ReactMarkdown>
                    )}
                    {canEdit && (
                        isEditing ? (
                            <button onClick={handleSaveClick}>Save</button>
                        ) : (
                            <button onClick={handleEditClick}>Edit</button>
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
