const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const save = async (req, res) => {
    const { courseId } = req.params;
    const { username } = req.body;

    try {
        const course = await prisma.courses.findUnique({
            where: { title: courseId },
        });

        if (!course) {
            return res.status(404).send('Course not found');
        }

        if (!course.userId.includes(username)) {
            const updatedCourse = await prisma.courses.update({
                where: { title: courseId },
                data: {
                    userId: [...course.userId, username],
                },
            });
            res.json(updatedCourse);
        } else {
            res.status(400).send('User already saved this course');
        }
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).send('Error saving course');
    }
};

//rating
const rating = async (req, res) => {
    const { courseId } = req.params;
    const { rating } = req.body;
    try {
        const course = await prisma.courses.findUnique({
            where: { title: courseId },
        });
        if (!course) {
            return res.status(404).send("Course not found");
        }
        const updatedRatings = [...course.rating, parseFloat(rating)];
        const updatedCourse = await prisma.courses.update({
            where: { title: courseId },
            data: {
                rating: updatedRatings,
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
};

//likes
const like = async (req, res) => {
    const { title } = req.params;
    try {
        const updatedLike = await prisma.courses.update({
            where: { title: title },
            data: {
                likes: {
                    increment: 1
                }
            }
        });
        res.json(updatedLike);
    } catch (error) {
        console.error("Error updating like votes:", error);
        res.status(500).send("Failed to update like");
    }
};

const editDescriptions = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    try {
        const updatedTopic = await prisma.topics.update({
            where: { id: parseInt(id) },
            data: { description },
        });
        res.json(updatedTopic);
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).send('Failed to update topic');
    }
};

module.exports =  {save, like, rating, editDescriptions};
