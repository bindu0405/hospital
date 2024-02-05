const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
 const express = require('express');
 const app=express();


 var jwtSecret=process.env.JWT_SECRET || "hospital-01";

 

function generateToken(userId, role,email) {
  console.log(userId,"------------",role)
  return jwt.sign({ userId: userId, role: role, email: email }, jwtSecret, { expiresIn: '1h' });
}


function verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

async function verifyToken(token) {
  return jwt.verify(token,"hospital-01")
}
 

module.exports = { generateToken, verifyPassword, verifyToken, };
