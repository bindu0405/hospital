const express = require('express');
const router = express.Router();
const clinicService = require('../services/clinicServices');
//const Token = require("../loaders/jwt")
//const TemporaryPassword = require('./passwordModel');
//const sendPassword = require('../lib/sendmail');



//const decrypt=require('../loaders/decrypt')

router.post('/clinics', async (req, res,next) => {
  try {
    //console.log("=====================================");
    const clinicData = req.body;
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     req.token = bearerHeader.replace('Bearer ', '');
    }
     const registeredClinic = await clinicService.registerClinic(clinicData,req.token);
     res.status(201).send(registeredClinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/clinic/login', async function(req, res) {
  try {
    let clinicId=req.body.clinicId;
    let  email = req.body.email;
    const result = await clinicService.loginClinic(req.body,clinicId, email);
    res.json({ clinic: result.clinics, token: result.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});



router.get('/clinics/:clinicId', async (req, res) => {
  try {
    const clinicId = req.params.clinicId;
    const clinic = await clinicService.getClinicById(clinicId);


    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add other clinic routes as needed

module.exports = router;