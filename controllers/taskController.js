
const Task = require('../models/task');

const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo, projectId } = req.body;

  try {
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      projectId,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data', error: error.message });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  try {
    let task = await Task.findById(taskId);

    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      task.assignedTo = assignedTo || task.assignedTo;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid task data', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);

    if (task) {
      await task.remove();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
const getTasks = async (req, res) => {
  const { status, priority, dueDate, assignedTo, projectId } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
  if (assignedTo) filter.assignedTo = assignedTo;
  if (projectId) filter.projectId = projectId;

  try {
    const tasks = await Task.find(filter).populate('assignedTo', 'email role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createTask, updateTask, deleteTask, getTasks };
