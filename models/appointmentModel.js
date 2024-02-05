const mongoose = require('mongoose');

// Enum for appointment status
const appointmentStatusEnum = ['pending', 'completed', 'success', 'rejected', 'canceled'];

// Define Appointment Schema
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    ref: 'Doctor', // Reference to the Doctor model
    required: true,
  },
  patientEmail: {
    type: String,
    ref: 'Patient', // Reference to the Patient model
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: appointmentStatusEnum,
    default: 'pending',
  },
});

// Create Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;