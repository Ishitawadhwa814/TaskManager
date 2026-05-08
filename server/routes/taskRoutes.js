const router = require("express").Router();
const auth = require("../middleware/auth");
const Task = require("../models/Task");

router.post("/", auth, async (req, res) => {
    try {
        const { title, description, status, dueDate, assignedTo, project } = req.body;

        if (!title || !project)
            return res.status(400).json({ message: "Task title and project are required." });

        const task = await Task.create({
            title,
            description,
            status,
            dueDate,
            assignedTo,
            project,
            createdBy: req.user.id
        });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name email role")
            .populate("project", "name description");

        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate("assignedTo", "name email role").populate("project", "name description");

        if (!task)
            return res.status(404).json({ message: "Task not found" });

        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
