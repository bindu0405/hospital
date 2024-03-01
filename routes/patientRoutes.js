const express = require('express');
const router = express.Router();
const patientService = require('../services/patientService');

// Route for creating a new patient for register
router.post('/registerPatient', async (req, res) => {
  try {
    let patientData = req.body;

    let newPatient = await patientService.registerPatient(patientData);
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/patients/login', async function(req, res){
  try{
    let patientData=req.body;
    let email=req.body.email;
    let otp=req.body.otp;
    let phoneNo=req.body.phoneNo
    let result=await patientService.loginPatient(patientData, email, otp, phoneNo );
   res.status(201).json({ token:result.token, message:result.message})
  }catch(err){
    throw err;
  }
})

router.post('/verifyOTP', async function(req, res){
  try{
   
    //console.log(otp, "otp---------", {required:true})
    let result=await patientService.verifyOTP(req.body);
    res.status(201).json({result})
  }catch(err){
    throw err;
  }
})


// Route for retrieving patient details by ID
router.get('/:patientId', async (req, res) => {
  try {
    let patientId = req.params.patientId;
    let patient = await patientService.getPatientById(patientId);
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