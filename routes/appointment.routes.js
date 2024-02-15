const express = require('express');
const appointmentRoutes = express.Router();

const { createAppointment, listAppointments, getAppointmentById, confirmAppointment, rejectAppointment } = require('../controllers/appointment.controllers');

appointmentRoutes.post('/donate', createAppointment );
appointmentRoutes.get('/listAppointments', listAppointments);
appointmentRoutes.get('/getOneAppointMent/:appointmentId', getAppointmentById);
appointmentRoutes.put('/confirmAppointment/:appointmentId', confirmAppointment);
appointmentRoutes.put('/rejectAppointment/:appointmentId', rejectAppointment)




module.exports = appointmentRoutes;