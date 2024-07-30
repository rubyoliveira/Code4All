const express = require('express');
const {login, signup} = require( '../controllers/authController.js')
const authRoutes = express.Router();

authRoutes.post("/create", signup)
authRoutes.post("/login", login)

module.exports = authRoutes;
