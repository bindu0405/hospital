
const jwt = require('jsonwebtoken');

async function handleDecodedPayload(decodedPayload){
const encryptedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOnsidXNlcklkIjoiNjU2ZWM4ZTBmYjcwOTZjNThiZWU0ODhkIiwicm9sZSI6ImFkbWluIiwibmFtZSI6ImpvaG4iLCJlbWFpbElkIjoia0BnbWFpbC5jb20ifSwiaWF0IjoxNzAxODcxODA5LCJleHAiOjE3MDE4NzU0MDl9.9YhnXb9Jv5mPZXYvWa5hKBAV2E2ErAzoVEPCtVFz1xA'; // Replace with the actual encrypted token
const secretKey = process.env.JWT_SECRET || 'hospital-01';

try {
   decodedPayload = jwt.verify(encryptedToken, secretKey);
  console.log(decodedPayload,decodedPayload.userId,  "opopop");
  //req.id
  console.log(decodedPayload.userId.emailId,"------")
} catch (error) {
  console.error('Error decoding token:', error.message);
}
}
module.exports={handleDecodedPayload:handleDecodedPayload};


let isDoctorOnline = false;

app.use(bodyParser.json());

// Endpoint to get the doctor's status
app.get('/doctor/status', (req, res) => {
  res.json({ status: isDoctorOnline ? 'online' : 'offline' });
});

// Endpoint to simulate doctor login
app.post('/doctor/login', (req, res) => {
  isDoctorOnline = true;
  res.json({ status: 'online' });
});

// Endpoint to simulate doctor logout
app.post('/doctor/logout', (req, res) => {
  isDoctorOnline = false;
  res.json({ status: 'offline' });
});