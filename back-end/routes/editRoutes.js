const express = require('express');
const {save, like, rating} = require( '../controllers/editController.js')
const editRoutes = express.Router();


editRoutes.post('/:courseId/rate', rating)
editRoutes.patch('/:courseId/save', save)
editRoutes.patch('/:title', like)

module.exports = editRoutes;
