const mongoose = require('mongoose');

var clinicSchema = new mongoose.Schema({
  role: { type: String, default: "CLINIC" },
  clinicName: { type: String, required: true },
  clinicId: { type: String, required: true, unique: true },
  clinicEmail: { type:String, required: true, unique: true},
  password: { type: String, required: false },
  address: { type: String, required: true },
  timings: { type: Array, required: true },
  registeredBy: { type: String, ref: 'Admin.emailId', required:false },
  registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
});



var Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;


