const express = require('express');
const { getAdminProfile, getAllAdmins, generalLogin,AdminSignUp} = require('../controllers/admin.controllers');

const adminRouter = express.Router();

adminRouter.post('/signup', AdminSignUp);
adminRouter.post('/login', generalLogin);
adminRouter.get('/adminProfile/:adminId', getAdminProfile);
adminRouter.get('/listallAdmins', getAllAdmins)


module.exports = adminRouter;