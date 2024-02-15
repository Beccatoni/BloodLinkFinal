const {addHospital, getHospital, login} = require('../controllers/hospital.controllers')
const express = require('express')
const authenticateAdmin = require('../middlewares/authenticateAdmin')
const hospitalRoutes =  express.Router();


hospitalRoutes.post('/addHospital', authenticateAdmin,  addHospital)
hospitalRoutes.post('/login', login);
hospitalRoutes.get('/hospitalProfile/:hospitalCode', getHospital)


module.exports = hospitalRoutes