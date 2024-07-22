const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.post("/create", async (req, res) => {
    const { username, password, email, name, complete } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashed = await bcrypt.hash(password, saltRounds);
        const newUser = await prisma.user.create({
            data: {
                username,
                hashedPassword: hashed,
                email,
                complete,
                name
            }
        });
        res.status(201).json({ message: "User created successfully", username });
    } catch (e) {
        console.error("Error creating user:", e);
        res.status(500).json({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userRecord = await prisma.user.findUnique({
        where: { username }
    });
    if (!userRecord) {
        return res.status(404).json({ error: "User not found" });
    }
    const isValid = await bcrypt.compare(password, userRecord.hashedPassword);
    if (isValid) {
        const userToSend = {
            username: userRecord.username,
        };
        res.status(200).json({ message: "Login successful", user: userToSend });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});

app.get('/profile/:username', async (req, res) => {
    const { username } = req.params;
    const profile = await prisma.user.findFirst({
        where: { username: username }
    });
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/code-pad', async (req, res) => {
    const coding = await prisma.ide.findMany();
    res.json(coding);
})

app.get('/profile/:username/saved-courses', async (req, res) => {
    const { username } = req.params;
    const saved = await prisma.courses.findMany({
        where: { userId: {has: username}}
    });
    res.json(saved)
});


app.get('/profile/:username/created-courses', async (req, res) => {
    const { username } = req.params;
    const created = await prisma.courses.findMany({
        where: { author: username }
    });
    res.json(created)
});

app.get('/profile/:username/completed-courses', async (req, res) => {
    const { username } = req.params;
    const complete = await prisma.courses.findMany({
        where: { completedBy: {has: username}}
    });
    res.json(complete)
});

app.patch('/profile/:username/picture', async (req, res) => {
    const { username } = req.params;
    const { photo } = req.body;
    try {
        const dogPic = await prisma.user.update({
            where: { username: username },
            data: {
                image: photo
            }
        });
        res.json(dogPic);
    } catch (error) {
        console.error("Error updating picture:", error);
        res.status(500).send("Failed to picture");
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
                        modules: true
                    }
                }
            }
        });
        if (!module) {
            return res.status(404).send("Module not found");
        }
        if (!module.completedBy.includes(username)) {
            const updatedModule = await prisma.modules.update({
                where: { id: parseInt(moduleId) },
                data: {
                    completedBy: [...module.completedBy, username]
                }
            });
            const allModulesCompleted = module.course.modules.every(m =>
                m.completedBy.includes(username)
            );
            if (allModulesCompleted) {
                if (!module.course.completedBy.includes(username)) {
                    await prisma.courses.update({
                        where: { title: module.courseId },
                        data: {
                            completedBy: [...module.course.completedBy, username]
                        }
                    });
                }
            }
            res.json(updatedModule);
        } else {
            res.status(400).send("User has already completed this module");
        }
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


app.get('/courses', async (req, res) => {
    const courses = await prisma.courses.findMany();
    res.json(courses);

});

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

app.get('/courses/:courseId', async (req, res) => {
    const {courseId} = req.params;
    const modules = await prisma.modules.findMany({
        where: { courseId: courseId }
    });
    res.json(modules);
});

app.patch('/courses/:title', async (req, res) => {
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
});


app.get('/courses/:courseId/:moduleId', async (req, res) => {
    const {moduleId} = req.params;
    const topics = await prisma.topics.findMany({
        where: { moduleId: parseInt(moduleId) }
    });
    res.json(topics);
});

app.post('/courses/create', async (req, res) => {
    const { title, description, difficulty, image, author, userId, modules } = req.body;

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
});

app.delete('/courses/:id/delete', async (req, res) => {
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
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
