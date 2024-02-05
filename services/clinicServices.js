const Clinic = require('../models/clinicModel');
const Token =require('../loaders/jwt')
const Admin = require('../models/adminModel')
const Email = require('../lib/validator');
const sendmail = require('../lib/sendmail');

async function registerClinic(clinicData,token) {    //token is nothing but req.token, pop=req.token
  try {
    console.log(clinicData,Clinic,sendmail,clinicData.clinicEmail,  "---------------------------------")
    const decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken);
  
    const admin = await Admin.findById({_id:decodedToken.userId})
    console.log( admin,admin.emailId,  "+++++++++++++admin admin")
    const clinics=await Clinic.findOne({clinicId:clinicData.clinicId});
    const email= await Clinic.findOne({clinicEmail:clinicData.clinicEmail})

    try {  
    if(admin!=null){
      if(clinics!=null){
        return {message:" clinicId already existed"}
      }
      else if(email!=null){
        return {message: " emailId alreay existed! give uniqe emailId"}
      }  
      else{
            let password = sendmail.generateTemporaryPassword();
            clinicData.password = password;
            const clinic= new Clinic(clinicData);
            await clinic.save();
         let emailSending= sendmail.sendTemporaryPassword( password)
         console.log(emailSending, "0---")
         return clinic;
      }
    }
    else{
      return {message: "invalid admin credentials"}
    }
    
    } catch (error) {
     console.error('Error decoding token:', error.message);
    }
   
  } catch (error) {
     throw error;
  }
}

async function loginClinic(  email, clinicId){
  try {
    console.log(email,Clinic,clinicId, "emailId??")
    const clinics = await Clinic.findOne({clinicId:clinicId})
   
    // Generate JWT token
    const token = Token.generateToken(clinics._id,'clinic',clinics.email, clinics.clinicId); 
      console.log(clinics, token ,"888888888888")

      const decodedToken = await Token.verifyToken(token);
      console.log("Decoded Token:", decodedToken);
      
      return { clinics, token};
  } catch (error) {
    console.log(error, "ererere")
    throw error;
  }
}


async function getClinicById(clinicId, req) {
  console.log(Clinic,clinicId,   "oppppppo")
  try {
     console.log("oppppppo")
     const clinic = await Clinic.findOne({clinicId});
     console.log(clinic,clinicId,  "-----------get")
    return clinic;
  } catch (error) {
    throw error;
  }
}

// Add other clinic services as needed

module.exports = {
  registerClinic: registerClinic,
  getClinicById:getClinicById,
  loginClinic:loginClinic

};
