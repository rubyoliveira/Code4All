const express = require('express');
const {createIDE, codePad, saveCode, IDE, terminate} = require(  '../controllers/codingController.js')

const codingRoutes = express.Router();

codingRoutes.get('/', IDE)
codingRoutes.post('/create-ide', createIDE)
codingRoutes.get('/:idHash', codePad)
codingRoutes.put('/:idHash/save', saveCode)
codingRoutes.delete('/:idHash/delete', terminate)


module.exports =  codingRoutes;
