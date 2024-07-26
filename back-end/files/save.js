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

function generateRandomHash(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let hash = ''
    for (let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex]
    }
    return hash;
}

app.post ('/create-ide', async (req, res) => {
    const {code, users, creator} = req.body

    let idHash;
    let hashExists = true;

    while (hashExists) {
        idHash = generateRandomHash();
        const existingHash = await prisma.interactiveIDE.findUnique({
            where: {idHash}
        })

        if (!existingHash){
            hashExists = false;
        }
    }

    try {
        const newIDE = await prisma.interactiveIDE.create({
            data: {
                idHash,
                code,
                users,
                creator,
            }
        });
        res.status(201).json(newIDE);
    } catch(error) {
        res.status(500).json({error: "Failed to create an IDE session"})
    }
})
