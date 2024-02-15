const express = require('express');
const adminRouter = require('./admin.routes');
const hospitalRoutes = require('./hospital.routes');
const appointmentRoutes = require('./appointment.routes');
const authRoutes = require('./auth.routes');
const allRoutes = express.Router();

allRoutes.use('/admin', adminRouter);
allRoutes.use('/hospital',hospitalRoutes);
allRoutes.use('/appointment', appointmentRoutes);
allRoutes.use('/auth', authRoutes);


module.exports = allRoutes;