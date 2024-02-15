const express = require('express');
const adminRouter = require('./admin.routes');
const hospitalRoutes = require('./hospital.routes');
const allRoutes = express.Router();

allRoutes.use('/admin', adminRouter);
allRoutes.use('/hospital',hospitalRoutes);


module.exports = allRoutes;