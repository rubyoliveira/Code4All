const express = require('express');
const { courses, modules, topics, create, deleteCourse, editDescriptions } = require( '../controllers/coursesController.js')
const coursesRoutes = express.Router();

coursesRoutes.get('/', courses)
coursesRoutes.get('/:courseId', modules)
coursesRoutes.get('/:courseId/:moduleId', topics)
coursesRoutes.post('/create', create)
coursesRoutes.delete('/:id/delete', deleteCourse)
coursesRoutes.put('/:courseId/:moduleId/topics/:id', editDescriptions)

module.exports =  coursesRoutes;
