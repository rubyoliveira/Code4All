const express = require('express');
const {setCompleted, completed, moduleComplete}= require( '../controllers/completionController.js')
const completionRoutes = express.Router();


completionRoutes.patch('/modules/:moduleId/completed', setCompleted)
completionRoutes.get('/courses/:title/completed-by/:username', completed)
completionRoutes.post('/modules/:moduleId/completion', moduleComplete)

module.exports = completionRoutes;
