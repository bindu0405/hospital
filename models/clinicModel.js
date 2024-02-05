const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
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

//const crypto = require('crypto');

// class TemporaryPassword {
//   constructor(email, tempPassword) {
//     this.email = email;
//     this.tempPasswordHash = this.hashPassword(tempPassword);
//     this.expiryTime = new Date(Date.now() + 5 * 60 * 1000); // Temporary password is valid for 5 minutes
//   }

//   hashPassword(password) {
//     // Use a secure hashing algorithm, such as SHA-256
//     const hash = crypto.createHash('sha256');
//     return hash.update(password).digest('hex');
//   }
//}

//module.exports = TemporaryPassword;

const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;


