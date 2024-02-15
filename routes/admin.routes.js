const express = require('express');
const { getAdminProfile, getAllAdmins, generalLogin,} = require('../controllers/admin.controllers');

const adminRouter = express.Router();

adminRouter.post('/login', generalLogin);
adminRouter.get('/adminProfile/:adminId', getAdminProfile);
adminRouter.get('/listallAdmins', getAllAdmins)


module.exports = adminRouter;