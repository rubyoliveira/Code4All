const express = require('express');
const {profile, completed, created, saved, dogPic, addRecommendation, recommendations, coding} = require( '../controllers/profileController.js')
const profileRoutes= express.Router();


profileRoutes.get('/:username', profile)
profileRoutes.get('/:username/saved-courses', saved)
profileRoutes.get('/:username/created-courses', created)
profileRoutes.get('/:username/completed-courses', completed)
profileRoutes.get('/:username/recommendations', recommendations)
profileRoutes.patch('/:username/add-recommendation', addRecommendation)
profileRoutes.patch('/:username/picture', dogPic)
profileRoutes.get('/:username/coding-sessions', coding)

module.exports = profileRoutes;
