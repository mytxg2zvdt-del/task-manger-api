const express = require('express');
require('dotenv').config();

const sequelize = require('./db');
const User = require('./models/user.model');
const Task = require('./models/task.model');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const authMiddleware = require('./middlewares/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Task Manager API'
    });
});

app.use('/api/auth', authRoutes);

app.get('/api/auth/me', authMiddleware, (req, res) => {
    res.json({
        message: 'Token is valid!',
        user: req.user
    });
});

app.use('/api/tasks', taskRoutes);

async function startServer() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log('Database connected and tables synchronized.');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
    }
}

startServer();