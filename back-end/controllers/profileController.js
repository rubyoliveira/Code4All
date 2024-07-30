const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const profile = async (req, res) => {
    const { username } = req.params;
    const profile = await prisma.user.findFirst({
        where: { username: username }
    });
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).send('User not found');
    }
};

const saved = async (req, res) => {
    const { username } = req.params;
    const saved = await prisma.courses.findMany({
        where: { userId: {has: username}}
    });
    res.json(saved)
};


const created = async (req, res) => {
    const { username } = req.params;
    const created = await prisma.courses.findMany({
        where: { author: username }
    });
    res.json(created)
};

const completed = async (req, res) => {
    const { username } = req.params;
    const complete = await prisma.courses.findMany({
        where: { completedBy: {has: username}}
    });
    res.json(complete)
};

const recommendations = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { recommendations: true }
        });
        if (user) {
            res.json(user.recommendations);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
};


//patching to profile
const addRecommendation = async (req, res) => {
    const { username } = req.params;
    const { newRecommendations } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { recommendations: true }
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: {
                recommendations: newRecommendations.slice(0,3),
            },
            select: { recommendations: true }
        });
        res.json(updatedUser.recommendations);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error: ' + error.message);
    }
};

const dogPic = async (req, res) => {
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
};


module.exports =  {profile, completed, created, saved, dogPic, addRecommendation, recommendations};
