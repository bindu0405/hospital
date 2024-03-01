const express = require('express');
const router = express.Router();
const Doctor = require('../models/doctor')
const doctorService = require('../services/doctorService');

router.post('/doctors', async function(req, res){
  try {
    let doctorData = req.body;
    let bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     req.token = bearerHeader.replace('Bearer ', '');
    }
    let createdDoctor = await doctorService.createDoctor(doctorData, req.token);
    
    res.status(201).json(createdDoctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/doctors/login', async function(req, res){
  try{
    let doctorData=req.body;
    let emailId=req.body.emailId;
    let password=req.body.password;
    let confirmPw=req.body.confirmPw;
    let result=await doctorService.loginDoctor(doctorData, emailId, password,confirmPw );
   res.status(201).json({doctor:result.doctors, token:result.token, message:result.message})
  }catch(err){
    throw err;
  }
})

router.post('/doctors/logout', async function(req, res){
  try{
    let emailId=req.body.emailId;
    let result=await doctorService.logoutDoctor( emailId);
   res.status(201).json({doctor:result.doctors})
  }catch(err){
    throw err;
  }
})

router.get('/doctors/:emailId', async (req, res) => {
  try {
    let emailId = req.params.emailId;
    let doctor = await doctorService.getDoctorByEmail(emailId);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/getAllDoctors', async (req, res) => {
  try {
    
    let result = await doctorService.getAllDoctors(req, res);
    console.log(result,  ",,,,,,,,,,,,")
    return res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/map-collections', async (req, res) => {
  try {
    let result = await doctorService.mapTwoCollections();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error mapping collections:", error);
    res.status(500).json({ error: "An error occurred while mapping collections" });
  }
});

// Add other doctor routes as needed

module.exports = router;