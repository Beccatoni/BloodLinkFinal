const {addHospital, getHospital, login, listHospitals} = require('../controllers/hospital.controllers')
const express = require('express')
const authenticateAdmin = require('../middlewares/authenticateAdmin')
const hospitalRoutes =  express.Router();


hospitalRoutes.post('/addHospital',   addHospital)
hospitalRoutes.post('/login', login);
hospitalRoutes.get('/list', listHospitals);
hospitalRoutes.get('/hospitalProfile/:hospitalCode', getHospital)


module.exports = hospitalRoutes