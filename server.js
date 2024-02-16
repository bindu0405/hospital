const express = require('express');
const bodyParser = require('body-parser');
const db = require('./dbconnections/mongoose');
const WebSocket = require('ws');
const http = require('http');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());


// Routes
const doctorRoutes = require('./routes/doctorRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const adminRoutes=require('./routes/adminRoutes');
const patientRoutes=require('./routes/patientRoutes');
const appointmentRoutes=require('./routes/appointmentRoutes');

app.use('/doctor', doctorRoutes);
app.use('/clinic', clinicRoutes);
app.use('/admin', adminRoutes);
app.use('/patient', patientRoutes)
app.use('/appointment', appointmentRoutes)
//console.log(decodedPayload)

// const socket = new WebSocket('http://0.0.0.0:3000/doctor/doctors/login');

// // Listen for messages
// socket.addEventListener('message', (event) => {
//   const data = JSON.parse(event.data);
//   console.log(data, "99999999999")
//   updateStatus(data.status);
// });

// // Update the status in the HTML
// function updateStatus(status) {
//   console.log(status, "00000000000")
//   const statusElement = document.getElementById('status');
//   statusElement.textContent = `status: ${status}`;
// }

// // Simulate doctor login and logout
// setTimeout(() => {
//   socket.send(JSON.stringify({ loginState: 'login' }));
// }, 2000);

// setTimeout(() => {
//   socket.send(JSON.stringify({ loginState: 'logout' }));
// }, 5000);

console.log(port,"PORT")
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});