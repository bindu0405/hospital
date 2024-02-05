const nodemailer = require('nodemailer');
const crypto = require('crypto');
const Admin=require('../models/adminModel')
const Clinic=require('../models/clinicModel')

function generateTemporaryPassword() {
  return crypto.randomBytes(8).toString('hex'); // Generate an 8-character random password
}

function sendTemporaryPassword(password) {
  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    host:"smtp.gmail.com",
    port:587,
    secure:false,
    auth: {
        user: 'peravalibindu4@gmail.com',
        pass: 'aneq ronn ivam orpk  '
    }
});
  const mailOptions = {
    from: `peravalibindu4@gmail.com`,
    to: `bindu.peravali@archents.com`,
    subject: 'Your Temporary Password',
    text: `Your temporary password is: ${password}. Please change it after login.`,
    
  };
  //return mailOptions;
  mailTransporter.sendMail(mailOptions, function(err, data) {
    if(err) {
      //return (err);
        console.log(err, 'error occurs');
    } else {
        console.log('Email sent successfully');
    }
});
}

module.exports = { 
  generateTemporaryPassword: generateTemporaryPassword, 
  sendTemporaryPassword:sendTemporaryPassword,
};