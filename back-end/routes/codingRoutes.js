const express = require('express');
const {createIDE, codePad, saveCode, IDE} = require(  '../controllers/codingController.js')

const codingRoutes = express.Router();


codingRoutes.post('/create-ide', createIDE)
codingRoutes.get('/:idHash', codePad)
codingRoutes.put('/:idHash/save', saveCode)

module.exports =  codingRoutes;
