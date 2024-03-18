const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});

// Create a Task model using the schema
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
