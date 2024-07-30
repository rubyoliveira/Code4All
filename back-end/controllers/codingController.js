const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function generateRandomHash(length = 5) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let hash = ''
    for (let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * characters.length);
        hash += characters[randomIndex]
    }
    return hash;
}

const createIDE = async (req, res) => {
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
};

const codePad =async (req, res) => {
    const {idHash} = req.params

    try{
        const ideSession = await prisma.interactiveIDE.findUnique({
            where: {idHash}
        })

        if(!ideSession) {
            return res.status(404).json({error: "IDE Session not found"})
        }

        res.json(ideSession)
    } catch(error) {
        res.status(500).json({error: "Failed to retrieve IDE session"})
    }
}

const saveCode = async (req, res) => {
    const {idHash} = req.params;
    const {code} = req.body;
    try {
        const saved = await prisma.interactiveIDE.update({
            where: { idHash },
            data: { code }
        });
        res.json(saved);
    } catch (error) {
        console.error("Error saving code:", error);
        res.status(500).send("Failed to save code");
    }
}

const IDE = async (req, res) => {
    const coding = await prisma.ide.findMany();
    res.json(coding);
}

module.exports =  {createIDE, codePad, saveCode, IDE};
