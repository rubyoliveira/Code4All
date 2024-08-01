import { useState } from 'react';
import CodeBot from "../../components/CodeBot.jsx";
import "./CreateCourse.css";

function CreateModules({ modules, setModules, setCurrentStep }) {
    const [moduleTitle, setModuleTitle] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [topicDescription, setTopicDescription] = useState('');
    const [currentModuleIndex, setCurrentModuleIndex] = useState(-1);

    const addModule = () => {
        const newModule = {
            title: moduleTitle,
            topics: [],
        };
        setModules([...modules, newModule]);
        setModuleTitle('');
        setCurrentModuleIndex(modules.length);
    };

    const addTopicToModule = () => {
        const newTopic = {
            title: topicTitle,
            description: topicDescription,
        };
        const updatedModules = [...modules];
        updatedModules[currentModuleIndex].topics.push(newTopic);
        setModules(updatedModules);
        setTopicTitle('');
        setTopicDescription('');
    };

    const handleNextModule = () => {
        setCurrentModuleIndex(-1);
        setCurrentStep(3);
    };

    return (
        <div className="create-page">
            {currentModuleIndex === -1 ? (
                <div>
                    <h2>Add a New Module</h2>
                    <div className="create-div">
                        <span className="create-span">Module Title</span>
                        <input className="create-input" placeholder='Module title..' value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
                    </div>
                    <button onClick={addModule} className="create-course">Add Module</button>
                </div>
            ) : (
                <div>
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
                    <button onClick={addTopicToModule} className="create-course">Add Topic</button>
                    <button onClick={handleNextModule} className="create-course">Finish Module</button>
                </div>
            )}
        </div>
    );
}

export default CreateModules;
