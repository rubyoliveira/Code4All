const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//get courses
const courses = async (req, res) => {
    const courses = await prisma.courses.findMany();
    res.json(courses);
};

//modules
const modules = async (req, res) => {
    const {courseId} = req.params;
    const modules = await prisma.modules.findMany({
        where: { courseId: courseId }
    });
    res.json(modules);
};

//topics
const topics = async (req, res) => {
    const {moduleId} = req.params;
    const topics = await prisma.topics.findMany({
        where: { moduleId: parseInt(moduleId) }
    });
    res.json(topics);
};

//create and delete courses
const create = async (req, res) => {
    const { title, description, difficulty, image, author, userId, modules } = req.body;

    // Validate required fields
    if (!title || !description || !difficulty || !image || !author || !userId || !modules || modules.length === 0) {
        return res.status(400).send('Missing required fields.');
    }

    try {
        const existingCourse = await prisma.courses.findUnique({
            where: { title }
        });

        if (existingCourse) {
            return res.status(409).json({ message: 'A course with this title already exists.' });
        }

        const newCourse = await prisma.courses.create({
            data: {
                title,
                description,
                difficulty,
                image,
                author,
                userId,
                modules: {
                    create: modules.map(module => ({
                        title: module.title,
                        topics: {
                            create: module.topics.map(topic => ({
                                title: topic.title,
                                description: topic.description,
                                video: topic.video
                            }))
                        }
                    }))
                }
            },
            include: {
                modules: {
                    include: {
                        topics: true
                    }
                }
            }
        });

        res.json(newCourse);
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).send('Error creating course: ' + error.message);
    }
};

const deleteCourse = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await prisma.$transaction(async (prisma) => {
            const modules = await prisma.modules.findMany({
                where: { courseId: id }
            });
            for (const module of modules) {
                await prisma.topics.deleteMany({
                    where: { moduleId: parseInt(module.id) }
                });
            }
            await prisma.modules.deleteMany({
                where: { courseId: id }
            });
            return await prisma.courses.delete({
                where: { title: id }
            });
        });
        res.json(result);
    } catch (error) {
        console.error("Error deleting card and its threads:", error);
        res.status(500).json({ message: "Error deleting card and its threads" });
    }
};


module.exports =  { courses, modules, topics, create, deleteCourse};
