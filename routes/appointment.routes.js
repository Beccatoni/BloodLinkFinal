const express = require('express');
const appointmentRoutes = express.Router();

const { createAppointment, listAppointments, getAppointmentById, confirmAppointment, rejectAppointment, updateAppointment } = require('../controllers/appointment.controllers');

appointmentRoutes.post('/donate', createAppointment );
appointmentRoutes.get('/listAppointments', listAppointments);
appointmentRoutes.get('/getOneAppointMent/:appointmentId', getAppointmentById);
appointmentRoutes.put('/confirmAppointment/:appointmentId', confirmAppointment);
appointmentRoutes.put('/rejectAppointment/:appointmentId', rejectAppointment)
appointmentRoutes.put('/rejectAppointment/:appointmentId', rejectAppointment)
appointmentRoutes.put('/updateAppointment/:appointmentId', updateAppointment)





module.exports = appointmentRoutes;