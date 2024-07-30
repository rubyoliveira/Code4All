const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const recommendations = async (courses, level, rating, currCourse, username) => {
    //filtering out the courses that don't have the same difficulty and courses thats rating is below what the user rates themselves
    const filteredCourses = courses.filter(course => {
        return course.difficulty === level && course.avgRating >= rating && course.title != currCourse && !course.completedBy.includes(username);
    });
    //sorting the courses to find the closest ratings to the users rating
    const sortedCourses = filteredCourses.sort((a, b) => a.avgRating - b.avgRating);
    //returning only the top 3 choices that are similar to the users input
    return (sortedCourses.slice(0, 3));
};

const setCompleted = async (req, res) => {
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
        // Update the module as completed by the user if not already done
        if (!module.completedBy.includes(username)) {
            await prisma.modules.update({
                where: { id: parseInt(moduleId) },
                data: {
                    completedBy: { push: username } // Use push if Prisma supports it, otherwise use set with spread as before
                }
            });
        }
        // Re-fetch module to ensure it includes the latest completion data
        const updatedModule = await prisma.modules.findUnique({
            where: { id: parseInt(moduleId) },
            include: {
                course: {
                    include: {
                        modules: true
                    }
                }
            }
        });
        // Check if all modules in the course are completed by the user
        let recommendationResults = [];
        const allModulesCompleted = updatedModule.course.modules.every(m =>
            m.completedBy.includes(username)
        );
        if (allModulesCompleted && !updatedModule.course.completedBy.includes(username)) {
            await prisma.courses.update({
                where: { title: updatedModule.course.title },
                data: {
                    completedBy: { push: username } // Similarly, use push or set appropriately
                }
            });

            const courses = await prisma.courses.findMany();
            recommendationResults = await recommendations(courses, updatedModule.course.difficulty, updatedModule.course.avgRating, updatedModule.course.title, username );
        }
        res.json({ message: "Module completion updated", updatedModule, recommendations: recommendationResults });
    } catch (error) {
        console.error("Error updating module completion:", error);
        res.status(500).send("Failed to update module completion");
    }
};


const completed = async (req, res) => {
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
};

const moduleComplete = async (req, res) => {
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
};

module.exports =  {setCompleted, completed, moduleComplete}
