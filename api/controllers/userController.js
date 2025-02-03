const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const JWT_SECRET = process.env.JWT || 'thisisjwt';

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if the email already exists
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const userId = await User.createUser({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ id: userId });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create a JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findUserById(req.user.id);
        // console.log(user);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const user = await User.findAllUsers();
        if (!user) {
            return res.status(404).json({ message: 'Users not found' });
        }

        // res.json({ id: user.id, username: user.username, email: user.email });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
