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



console.log(port,"PORT")
// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});