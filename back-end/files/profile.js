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

app.get('/profile/:username/recommendations', async (req, res) => {
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
});

app.patch('/profile/:username/add-recommendation', async (req, res) => {
    const { username } = req.params;
    const { newRecommendations } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: { recommendations: true }
        });

        if (user) {
            const updatedRecommendations = user.recommendations.concat(newRecommendations).slice(-3);

            const updatedUser = await prisma.user.update({
                where: { username: username },
                data: {
                    recommendations: updatedRecommendations,
                },
                select: { recommendations: true }
            });

            res.json(updatedUser.recommendations);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
