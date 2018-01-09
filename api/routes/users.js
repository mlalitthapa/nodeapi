const express = require('express');

const UsersController = require('../controllers/UsersController');

const router = express.Router();

router.post('/signup', UsersController.register);

router.post('/login', UsersController.login);

module.exports = router;
