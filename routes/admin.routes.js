const express = require('express');
const {adminLogin, getAdminProfile, getAllAdmins,} = require('../controllers/admin.controllers');

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/adminProfile/:adminId', getAdminProfile);
adminRouter.get('/listallAdmins', getAllAdmins)


module.exports = adminRouter;