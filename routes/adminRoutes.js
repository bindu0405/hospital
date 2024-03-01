
const router = (module.exports=require('express')())
const adminService = require('../services/adminservice');

router.post('/admin', async (req, res) => {
  try {
    let adminData = req.body;
    console.log(adminData,  "9000000000000000000000")
    let registeredAdmin= await adminService.registerAdmin(adminData);
    res.status(201).json(registeredAdmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/admin/login', async function(req, res) {
  try {
    let  emailId = req.body.emailId;
    let   password= req.body.password
    let result = await adminService.loginAdmin(req, emailId, password);
    res.json({ admin: result.admin, token: result.token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// Add other admin routes as needed

module.exports = router;
