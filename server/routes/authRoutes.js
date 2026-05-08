const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password)
            return res.status(400).json({ message: "Name, email, and password are required." });

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already registered." });

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashed,
            role
        });

        const { password: pwd, ...userData } = user.toObject();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: userData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(400).json({ message: "Invalid password" });

        const { password: pwd, ...userData } = user.toObject();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ token, user: userData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/verify", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
