const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const PORT = 3000;

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions));

app.post("/create", async (req, res) => {
    const { username, password } = req.body;
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
                hashedPassword: hashed
            }
        });
        res.status(201).json({ message: "User created successfully", userId: newUser.id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const userRecord = await prisma.user.findUnique({
            where: { username }
        });
        if (!userRecord) {
            return res.status(404).json({ error: "User not found" });
        }
        const isValid = await bcrypt.compare(password, userRecord.hashedPassword);
        if (isValid) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/courses', async (req, res) => {
    const courses = await prisma.courses.findMany();
    res.json(courses);
});

app.get('/courses/:courseId', async (req, res) => {
    const {courseId} = req.params;
    const modules = await prisma.modules.findMany({
        where: { courseId: courseId }
    });
    res.json(modules);
});


app.get('/courses/:courseId/:moduleId', async (req, res) => {
    const {moduleId} = req.params;
    const topics = await prisma.topics.findMany({
        where: { moduleId: moduleId }
    });
    res.json(topics);
});

app.post('/courses/create', async (req, res) => {
    const { title, description, difficulty, image, modules } = req.body;

    if (!title || !description || !difficulty || !image || !modules || modules.length === 0) {
        return res.status(400).send('Missing required fields.');
    }

    try {
        const newCourse = await prisma.courses.create({
            data: {
                title,
                description,
                difficulty,
                image,
                modules: {
                    create: modules.map(module => ({
                        title: module.title,
                        topics: {
                            create: module.topics.map(topic => ({
                                title: topic.title,
                                description: topic.description,
                                video: topic.video // Assuming 'video' is the correct field
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
        console.error(error);
        res.status(500).send('Error creating course');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
