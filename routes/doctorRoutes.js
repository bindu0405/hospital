const express = require('express');
const router = express.Router();
const doctorService = require('../services/doctorService');

router.post('/doctors', async function(req, res){
  try {
    const doctorData = req.body;
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     req.token = bearerHeader.replace('Bearer ', '');
    }
    const createdDoctor = await doctorService.createDoctor(doctorData, req.token);
    res.status(201).json(createdDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/doctors/login', async function(req, res){
  try{
    const doctorData=req.body;
    const emailId=req.body.emailId;
    const password=req.body.password;
    const confirmPw=req.body.confirmPw;
    const result=await doctorService.loginDoctor(doctorData, emailId, password,confirmPw );
   res.status(201).json({doctor:result.doctors, token:result.token, message:result.message})
  }catch(err){
    throw err;
  }
})

router.get('/doctors/:emailId', async (req, res) => {
  try {
    const emailId = req.params.emailId;
    const doctor = await doctorService.getDoctorByEmail(emailId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add other doctor routes as needed

module.exports = router;