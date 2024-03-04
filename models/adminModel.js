
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let saltRounds = 10;

let adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "ADMIN" }
});

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, saltRounds);
      this.password = hashedPassword;
      next();
    } catch (error) {
      return next(error);
    }
  } else {
    next();
  }
});

var Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
