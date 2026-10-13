const { Op } = require('sequelize');
const Task = require('../models/task.model');
async function createTask(req, res) {
    try {
        const { title, description, priority, dueDate } = req.body;
        if (typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({
                message: 'Task title is required.'
            });
        }
        const taskData = {
            title: title.trim(),
            userId: req.user.id
        };
        if (description !== undefined) {
            if (typeof description !== 'string') {
                return res.status(400).json({
                    message: 'Description must be text.'
                });
            }
            taskData.description = description;
        }
        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    message: 'Priority must be low, medium, or high.'
                });
            }
            taskData.priority = priority;
        }
        if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
            if (
                typeof dueDate !== 'string' ||
                Number.isNaN(Date.parse(dueDate))
            ) {
                return res.status(400).json({
                    message: 'Due date must be a valid date.'
                });
            }
            taskData.dueDate = new Date(dueDate);
        }
        const task = await Task.create(taskData);
        return res.status(201).json({
            message: 'Task created successfully.',
            task
        });
    } catch (error) {
        console.error('Create task error:', error.message);
        return res.status(500).json({
            message: 'Failed to create task.'
        });
    }
}
async function getTasks(req, res) {
    try {
        const { search, status, priority } = req.query;
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );
        const limit = Math.min(
            50,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );
        const offset = (page - 1) * limit;
        const where = {
            userId: req.user.id
        };
        if (search !== undefined) {
            if (typeof search !== 'string') {
                return res.status(400).json({
                    message: 'Search must be text.'
                });
            }
            if (search.trim()) {
                where.title = {
                    [Op.iLike]: `%${search.trim()}%`
                };
            }
        }
        if (status !== undefined) {
            if (!['pending', 'in_progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status.'
                });
            }
            where.status = status;
        }
        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    message: 'Invalid priority.'
                });
            }
            where.priority = priority;
        }
        const result = await Task.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset
        });
        return res.status(200).json({
            message: 'Tasks retrieved successfully.',
            count: result.count,
            currentPage: page,
            totalPages: Math.ceil(result.count / limit),
            tasks: result.rows
        });
    } catch (error) {
        console.error('Get tasks error:', error.message);
        return res.status(500).json({
            message: 'Failed to retrieve tasks.'
        });
    }
}
async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate } = req.body;
        const task = await Task.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });
        if (!task) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }
        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    message: 'Title must not be empty.'
                });
            }
            task.title = title.trim();
        }
        if (description !== undefined) {
            if (
                description !== null &&
                typeof description !== 'string'
            ) {
                return res.status(400).json({
                    message: 'Description must be text or null.'
                });
            }
            task.description = description;
        }
        if (status !== undefined) {
            if (!['pending', 'in_progress', 'completed'].includes(status)) {
                return res.status(400).json({
                    message: 'Invalid status.'
                });
            }
            task.status = status;
        }
        if (priority !== undefined) {
            if (!['low', 'medium', 'high'].includes(priority)) {
                return res.status(400).json({
                    message: 'Invalid priority.'
                });
            }
            task.priority = priority;
        }
        if (dueDate !== undefined) {
            if (dueDate === null || dueDate === '') {
                task.dueDate = null;
            } else {
                if (
                    typeof dueDate !== 'string' ||
                    Number.isNaN(Date.parse(dueDate))
                ) {
                    return res.status(400).json({
                        message: 'Due date must be a valid date or null.'
                    });
                }
                task.dueDate = new Date(dueDate);
            }
        }
        await task.save();
        return res.status(200).json({
            message: 'Task updated successfully.',
            task
        });
    } catch (error) {
        console.error('Update task error:', error.message);
        return res.status(500).json({
            message: 'Failed to update task.'
        });
    }
}
async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const task = await Task.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });
        if (!task) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }
        await task.destroy();
        return res.status(200).json({
            message: 'Task deleted successfully.'
        });
    } catch (error) {
        console.error('Delete task error:', error.message);
        return res.status(500).json({
            message: 'Failed to delete task.'
        });
    }
}
module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};