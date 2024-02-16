let Admin = require('../models/adminModel');
let authService = require('../loaders/jwt');
let Email = require('../lib/validator');

async function registerAdmin(adminData){
  try {
    let admin = new Admin(adminData);
   
    let map= Email.validateEmail(  
      admin.emailId
      )
    if(map){
      console.log(map, admin.emailId, "3333")
      const result = await admin.aggregate(pipeline).toArray();
      console.log(result, "=====")
      await admin.save();
      return admin;
    }
    else{
      throw new Error('Invalid emailId');
    }
  } catch (error) {
    throw error;
  }
}


async function loginAdmin( req, emailId, password,) {
  try {
    console.log(emailId,"emailId??")
    let admin = await Admin.findOne({emailId});
    console.log(admin, "9090")

    if(admin==null){
      throw new Error('Incorrect emaiiId');
      
    }
    var plainPassword=password;
    var hashedPassword=admin.password;

    console.log(password, admin.password, "======")
    let log=authService.verifyPassword(
     plainPassword, 
     hashedPassword
    ) 

    if ( log!=true) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    let token = authService.generateToken(admin._id,'admin',admin.emailId); 
      console.log(admin, token ,)

      return { admin, token};
  } catch (error) {
    throw error;
  }
}
  
  module.exports = { 
    registerAdmin:registerAdmin, 
    loginAdmin: loginAdmin };
  
   


