const express = require('express');
const router = express.Router();
const patientService = require('../services/patientService');

// Route for creating a new patient for register
router.post('/registerPatient', async (req, res) => {
  try {
    const patientData = req.body;

    const newPatient = await patientService.registerPatient(patientData);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/patients/login', async function(req, res){
  try{
    const patientData=req.body;
    const email=req.body.email;
    const otp=req.body.otp;
    const phoneNo=req.body.phoneNo
    const result=await patientService.loginPatient(patientData, email, otp, phoneNo );
   res.status(201).json({ token:result.token, message:result.message})
  }catch(err){
    throw err;
  }
})

router.post('/verifyOTP', async function(req, res){
  try{
   
    //console.log(otp, "otp---------", {required:true})
    const result=await patientService.verifyOTP(req.body);
    res.status(201).json({result})
  }catch(err){
    throw err;
  }
})


// Route for retrieving patient details by ID
router.get('/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const patient = await patientService.getPatientById(patientId);
    if (!patient) {
      res.status(404).json({ success: false, error: 'Patient not found' });
      return;
    }
    res.json({ success: true, patient });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add more routes as needed (update, delete, list, etc.)

module.exports = router;