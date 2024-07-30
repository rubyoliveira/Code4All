const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
};
app.use(cors(corsOptions));
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const saltRounds = 10;
const PORT = 3000;
const authRoutes = require('./routes/authRoutes');
const editRoutes = require('./routes/editRoutes');
const coursesRoutes = require('./routes/coursesRoutes');
const codingRoutes = require('./routes/codingRoutes');
const completionRoutes = require('./routes/completionRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/profile', profileRoutes);
app.use('/courses', coursesRoutes);
app.use('/courses', editRoutes);
app.use('/code-pad', codingRoutes);
app.use('/auth', authRoutes);
app.use('/completion', completionRoutes);

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
