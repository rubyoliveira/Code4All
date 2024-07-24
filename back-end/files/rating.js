
app.post('/courses/:courseId/rate', async (req, res) => {
    const { courseId } = req.params;
    const { rating } = req.body;

    try {
        // Assuming 'ratings' is an array of numbers stored in the database
        const course = await prisma.courses.findUnique({
            where: { title: courseId },
        });

        if (!course) {
            return res.status(404).send("Course not found");
        }

        const updatedRatings = [...course.ratings, parseFloat(rating)];

        const updatedCourse = await prisma.courses.update({
            where: { title: courseId },
            data: {
                ratings: updatedRatings,
            },
        });

        const averageRating = updatedRatings.reduce((a, b) => a + b, 0) / updatedRatings.length;

        await prisma.courses.update({
            where: { title: courseId },
            data: {
                avgRating: averageRating,
            },
        });

        res.json({ updatedCourse, averageRating });
    } catch (error) {
        console.error("Error submitting rating:", error);
        res.status(500).send("Failed to submit rating");
    }
});

app.get('/courses/:courseId/average-rating', async (req, res) => {
    const {courseId} = req.params;

    try {
        const course = await prisma.courses.findUnique({
            where: {title: courseId},
            select: {avgRating: true},
        });
        if (!course) {
            return res.status(404).send("Course not found");
        }
        res.json({averageRating: course.avgRating});
    } catch (error) {
        console.error("Error calculating average rating:", error);
        res.status(500).send("Failed to calculate average rating");
    }
});
