const express = require('express');
const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// POST /api/users/register
router.post('/register', userController.register);

// POST /api/users/login
router.post('/login', userController.login);

// PUT /api/users/update (protégé)
router.put('/update', auth, userController.update);

module.exports = router;
