const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: { type: Number, required:true, unique: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true , unique:true},
  dateOfBirth: { type: Date, required: true },
  password: { type: String, required: false },
  profilePhoto: { type: String }, // Assuming the profile photo is stored as a file path or URL
  verified: { type: Boolean, default: false },
 // otp: { type: String, required: true },
  //sid: {type: String, required: true },
  role: {
    type: String,
    enum: ['patient'],
    //default: 'patient',
    required: true,
  },

  createdOn: { type: Date, default: Date.now },
  // Other patient-related fields
});


const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;