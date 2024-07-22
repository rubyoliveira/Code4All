app.patch('/courses/:courseId/save', async (req, res) => {
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
});
