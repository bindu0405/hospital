const express = require('express');
const router = express.Router();
const clinicService = require('../services/clinicServices');


router.post('/clinics', async (req, res,next) => {
  try {
    //console.log("=====================================");
    let clinicData = req.body;
    let bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     req.token = bearerHeader.replace('Bearer ', '');
    }
     let registeredClinic = await clinicService.registerClinic(clinicData,req.token);
     res.status(201).send(registeredClinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/clinic/login', async function(req, res) {
  try {
    let clinicId=req.body.clinicId;
    let  email = req.body.email;
    let result = await clinicService.loginClinic(req.body,clinicId, email);
    res.json({ clinic: result.clinics, token: result.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});



router.get('/clinics/:clinicId', async (req, res) => {
  try {
    let clinicId = req.params.clinicId;
    let clinic = await clinicService.getClinicById(clinicId);


    if (!clinic) {
      return res.status(404).json({ message: 'Clinic not found' });
    }

    res.json(clinic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;