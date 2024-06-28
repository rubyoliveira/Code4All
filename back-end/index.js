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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
