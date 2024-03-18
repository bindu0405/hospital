//regular expressions in js
const validator = require('validator');

function validateEmail(email) {
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    console.log(email, "00000")
    return emailRegex.test(email);
  }
  // Example usage:
  var email1 = "user@example.com";
  var email2 = "invalid-email";
  console.log(validateEmail(email1)); // Should return true
  console.log(validateEmail(email2)); // Should return false

  module.exports={ validateEmail: validateEmail}