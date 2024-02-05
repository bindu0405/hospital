const express = require('express');
const router = express.Router();
const appointmentService = require('../services/appointmentService');


router.get('/doctorsData', appointmentService.doctorsData)
// Route to create a new appointment
router.post('/appointments', appointmentService.createAppointment);

router.post('/getAllDoctorAppointments', appointmentService.getAllDoctorAppointments);

router.post('/getAllPatientAppointments', appointmentService.getAllPatientAppointments);

router.get('/confirmAppointment', appointmentService.confirmAppointment);

router.get('/cancelAppointment', appointmentService.cancelAppointment);

// Route to update an appointment by ID
router.put('/appointments/:appointmentId', appointmentService.updateAppointment);

// Route to delete an appointment by ID
router.delete('/appointments/:appointmentId', appointmentService.deleteAppointment);

module.exports = router;