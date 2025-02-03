// routes/users.js

const express = require("express");
const { getUsers,getUser,deleteUser,editUser, merchantAccount } = require("../controllers/userController");
const authenticateToken = require("../controllers/auth");
const router = express.Router();





const userController = require('../controllers/userController');

// Define routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/', userController.getUsers);
router.get('/profile', authenticateToken, userController.getUserProfile);

module.exports = router;
