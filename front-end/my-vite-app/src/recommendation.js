export const fetchCards = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;
    }
};

const handleRecommendations = (username, recommendations) => {
    fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/profile/${username}/add-recommendation`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newRecommendations: recommendations }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save recommendations');
        }
        return response.json();
    })
    .then(data => {
        alert(`Recommendations saved successfully: ${JSON.stringify(data)}`);
    })
    .catch(error => {
        console.error('Error saving recommendations:', error);
    });
};

export { handleRecommendations };


export const recommendations = async (courses, level, rating) => {
    //fetching average rating of the course
    const fetchAverageRating = async (courseId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses/${courseId}/average-rating`);
            if (!response.ok) {
                throw new Error(`Failed to fetch average rating: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            return data.averageRating;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return null;
        }
    };
    //get all the ratings for the courses to allow for comparisons
    const ratings = await Promise.all(courses.map(course => fetchAverageRating(course.title)));
    const coursesWithRatings = courses.map((course, index) => ({
        ...course,
        avgRating: ratings[index]
    }));
    //filtering out the courses that don't have the same difficulty and courses thats rating is below what the user rates themselves
    const filteredCourses = coursesWithRatings.filter(course => {
        return course.difficulty === level && course.avgRating >= rating;
    });
    //sorting the courses to find the closest ratings to the users rating
    const sortedCourses = filteredCourses.sort((a, b) => a.avgRating - b.avgRating);
    //returning only the top 3 choices that are similar to the users input
    return (sortedCourses.slice(0, 3));
};
