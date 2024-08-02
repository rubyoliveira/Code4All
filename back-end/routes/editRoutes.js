const express = require('express');
const {save, like, rating, editDescriptions} = require( '../controllers/editController.js')
const editRoutes = express.Router();


editRoutes.post('/:courseId/rate', rating)
editRoutes.patch('/:courseId/save', save)
editRoutes.patch('/:title', like)
editRoutes.put('/editTopics/:id', editDescriptions);

module.exports = editRoutes;
