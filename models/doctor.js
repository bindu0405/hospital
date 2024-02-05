
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  role: { type: String, default: "DOCTOR" },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  confirmPw: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // 'this' refers to the document being validated
        return this.password === value;
      },
      message: 'Password and confirmPw must be the same.',
    },
  },
  phoneNo: { type: Number, required: true },
  clinicName: { type: String, required: false },
  clinicId: { type: String, require:false},
  specialty: { type: [String], required: true },
  status: { type: String, required: true , default:"offline"},
  availableTimings: { type: Array, required: true },
});

const bcrypt = require('bcrypt');

doctorSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password,  10);
      this.password = hashedPassword;
      this.confirmPw = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;