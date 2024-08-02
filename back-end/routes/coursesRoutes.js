const express = require('express');
const { courses, modules, topics, create, deleteCourse} = require( '../controllers/coursesController.js')
const coursesRoutes = express.Router();

coursesRoutes.get('/', courses)
coursesRoutes.get('/:courseId', modules)
coursesRoutes.get('/:courseId/:moduleId', topics)
coursesRoutes.post('/create', create)
coursesRoutes.delete('/:id/delete', deleteCourse)

module.exports =  coursesRoutes;
