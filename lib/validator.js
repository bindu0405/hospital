
const validator = require('validator');

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    console.log(email, "00000")
    return emailRegex.test(email);
  }
  // Example usage:
  const email1 = "user@example.com";
  const email2 = "invalid-email";
  console.log(validateEmail(email1)); // Should return true
  console.log(validateEmail(email2)); // Should return false

  module.exports={ validateEmail: validateEmail}