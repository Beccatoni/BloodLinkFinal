const express = require('express');
const appointmentRoutes = express.Router();

const { createAppointment, listAppointments, getAppointmentById, confirmAppointment, rejectAppointment } = require('../controllers/appointment.controllers');

appointmentRoutes.post('/donate', createAppointment );
appointmentRoutes.get('/listAppointments', listAppointments);
appointmentRoutes.get('/getOneAppointMent/:appointmentId', getAppointmentById);
appointmentRoutes.post('/confirmAppointment/', confirmAppointment);
appointmentRoutes.post('/rejectAppointment', rejectAppointment)




module.exports = appointmentRoutes;