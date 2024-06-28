const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
var cors = require('cors')
const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express()
const PORT = 3000

app.use(express.json());
app.use(cors());

app.post("/create", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        bcrypt.hash(password, saltRounds, async function(err, hashed) {
            if (err) {
                return res.status(500).json({ error: "Error hashing password" });
            }
            const newUser = await prisma.user.create({
                data: {
                    username,
                    hashedPassword: hashed
                }
            });
            res.status(200).json({ message: "User created successfully", userId: newUser.id });
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post("/login", async (req, res) => {
    const {user, password} = req.body;
    const userRecord = await prisma.user.findUnique({
        where : { user }
    });

    bcrypt.compare(password, userRecord.hashedPassword, function(err, result) {
        if (result) {
            res.status(200).json({});
        } else {
            res.status(500).json({"error": err});
        }
    });
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
