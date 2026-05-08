const router = require("express").Router();
const auth = require("../middleware/auth");
const Project = require("../models/Project");

router.post("/", auth, async (req, res) => {
    try {
        if (req.user.role !== "Admin")
            return res.status(403).json({ message: "Access denied" });

        const { name, description, members = [] } = req.body;

        if (!name)
            return res.status(400).json({ message: "Project name is required." });

        const project = await Project.create({
            name,
            description,
            members,
            createdBy: req.user.id
        });

        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("members", "name email role")
            .populate("createdBy", "name email role");

        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
