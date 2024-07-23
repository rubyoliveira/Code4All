export const fetchCards = () => {
     try {
        const response = fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/courses`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch(error) {
        console.error('Error fetching cards:', error);
        throw error;
      }
  };

export const recommendations = async (courses, level, rating) => {
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
    const ratings = await Promise.all(courses.map(course => fetchAverageRating(course.title)));
    const coursesWithRatings = courses.map((course, index) => ({
        ...course,
        avgRating: ratings[index]
    }));
    const filteredCourses = coursesWithRatings.filter(course => {
        return course.difficulty === level && course.avgRating >= rating;
    });
    const sortedCourses = filteredCourses.sort((a, b) => a.avgRating - b.avgRating);
    return (sortedCourses.slice(0, 3));
};
