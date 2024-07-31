const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const saltRounds = 10;


const signup = async (req, res) => {
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
};

const login = async (req, res) => {
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
};

module.exports = { login, signup };
