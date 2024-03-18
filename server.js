const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override'); // Import method-override

const Task = require('./models/task');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride('_method')); // Use method-override middleware
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

main().then(() => {
    console.log('Connection Successful');
}).catch((err) => {
    console.log(`Error Occurred ${err}`);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tasks", {});
}

app.get('/', (req, res) => {
    res.send('GO to /tasks Route to see tasks');
});

// Show Route 
app.get('/tasks', async (req, res) => {
    let tasks = await Task.find();
    res.render('home.ejs', { tasks });
});

// Create Route 
app.get('/newtask', (req, res) => {
    res.render('newTask.ejs');
});

app.post('/newtask', async (req, res) => {
    try {
        const task = new Task({
            title: req.body.title,
            description: req.body.description,
            date: new Date()
        });
        await task.save();
        res.redirect('/tasks');
    } catch (err) {
        console.error('Error creating task:', err);
        res.status(500).send('Error creating task');
    }
});

// View Route
app.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('viewTask.ejs', { task });
    } catch (err) {
        console.error('Error viewing task:', err);
        res.status(500).send('Error viewing task');
    }
});

// Update Route (Form)
app.get('/tasks/:id/update', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        res.render('updateTask.ejs', { task });
    } catch (err) {
        console.error('Error rendering update form:', err);
        res.status(500).send('Error rendering update form');
    }
});

// Update Route (Submit)
app.put('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description
        });
        res.redirect('/tasks');
    } catch (err) {
        console.error('Error updating task:', err);
        res.status(500).send('Error updating task');
    }
});

// Delete Route
app.delete('/tasks/:id/delete', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.redirect('/tasks');
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).send('Error deleting task');
    }
});

app.listen(8080, () => {
    console.log(`Server is running on port ${8080}`);
});
