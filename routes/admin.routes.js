const express = require('express');
const {adminLogin, getAdminProfile,} = require('../controllers/admin.controllers');

const adminRouter = express.Router();

adminRouter.post('/login', adminLogin);
adminRouter.get('/adminProfile/:adminId', getAdminProfile)


module.exports = adminRouter;