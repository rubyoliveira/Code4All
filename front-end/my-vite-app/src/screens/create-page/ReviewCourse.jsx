function ReviewCourse({ courseTitle, description, difficulty, image, modules }) {
    return (
        <div className = "contents-review">
            <div>
                <strong>Course Title:</strong> {courseTitle}
            </div>
            <div>
                <strong>Description:</strong> {description}
            </div>
            <div>
                <strong>Difficulty:</strong> {difficulty}
            </div>
            <div>
                <strong>Modules:</strong>
                {modules.map((module, index) => (
                    <div key={index}>
                        <h4>Module {index + 1}: {module.title}</h4>
                        {module.topics.map((topic, idx) => (
                            <div key={idx}>
                                <p> <strong>Topic {idx + 1}:</strong>{topic.title}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewCourse;
