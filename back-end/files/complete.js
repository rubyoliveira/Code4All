app.post('/modules/:moduleId/completion', async (req, res) => {
    const { moduleId } = req.params;
    const { username } = req.body;

    try {
        const module = await prisma.modules.findUnique({
            where: { id: parseInt(moduleId) }
        });
        if (!module) {
            return res.status(404).send("Module not found");
        }
        res.json(module);
    } catch (error) {
        console.error("Error fetching module:", error);
        res.status(500).send("Failed to fetch module");
    }
});


app.patch('/modules/:moduleId/completed', async (req, res) => {
    const { moduleId } = req.params;
    const { username } = req.body;

    try {
        const module = await prisma.modules.findUnique({
            where: { id: parseInt(moduleId) },
            include: {
                course: {
                    include: {
                        modules: true // Include all modules of the course
                    }
                }
            }
        });

        if (!module) {
            return res.status(404).send("Module not found");
        }

        let updatedModule;
        if (!module.completedBy.includes(username)) {
            updatedModule = await prisma.modules.update({
                where: { id: parseInt(moduleId) },
                data: {
                    completedBy: { set: [...module.completedBy, username] }
                }
            });
        }

        // Check if all modules in the course are completed by the user
        const allModulesCompleted = module.course.modules.every(m =>
            m.completedBy.includes(username)
        );

        if (allModulesCompleted) {
            if (!module.course.completedBy.includes(username)) {
                await prisma.courses.update({
                    where: { title: module.courseId },
                    data: {
                        completedBy: { set: [...module.course.completedBy, username] }
                    }
                });
            }
        }

        res.json(updatedModule || { message: "User has already completed this module", module });
    } catch (error) {
        console.error("Error updating module completion:", error);
        res.status(500).send("Failed to update module completion");
    }
});

app.get('/courses/:title/completed-by/:username', async (req, res) => {
    const { title, username } = req.params;

    try {
        const course = await prisma.courses.findUnique({
            where: { title }
        });

        if (!course) {
            return res.status(404).send('Course not found');
        }

        const isCompleted = course.completedBy.includes(username);
        res.json({ completed: isCompleted });
    } catch (error) {
        console.error('Error checking if course is completed by user:', error);
        res.status(500).send('Failed to check course completion');
    }
});

