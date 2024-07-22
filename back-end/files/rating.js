
app.post('/courses/:courseId/rate', async (req, res) => {
    const {courseId} = req.params;
    const {rating} = req.body;

    try{
        const course = await prisma.courses.update({
            where: {title: courseId},
            data: {
                rating: {
                    push: parseFloat(rating),
                }
            },
        });
        res.json(course)
    } catch(error){
        console.error("Error submitting rating:", error)
        res.status(500).send("Failed to submit rating");
    }
})

app.get('/courses/:courseId/average-rating', async (req, res) => {
    const {courseId} = req.params;
    
    try {
        const course = await prisma.courses.findUnique({
            where: {title: courseId},
            select: {rating: true},
        });
        if (!course) {
            return res.status(404).send("Course not found");
        }

        const averageRating = course.rating.reduce((a, b) => a + b, 0) / course.rating.length;
        res.json({averageRating});
    } catch (error) {
        console.error("Error calculating average rating:", error);
        res.status(500).send("Failed to calculate average rating");
    }
});
