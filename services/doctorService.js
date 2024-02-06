const Doctor = require('../models/doctor');
const Clinic = require('../models/clinicModel')
const Email= require('../lib/validator');
const Token= require('../loaders/jwt');
const WebSocket=require('../lib/websocketcom')


async function createDoctor(doctorData, token) {
  try {
    //const doctor=new Doctor(doctorData)

    const check =Email.validateEmail(doctorData.emailId)
    console.log(doctorData, check, doctorData.emailId, token,  "--------")

    const decodedToken = await Token.verifyToken(token);
      console.log("Decoded Token:", decodedToken);

    const clinic=await Clinic.findById({_id:decodedToken.userId}) 

    const doctors= await Doctor.findOne({emailId:doctorData.emailId}) 
    
    console.log(clinic,clinic.clinicName, clinic.clinicId,  doctors, doctorData, "=============--------")
    
    const doctor = new Doctor({
      clinicName:clinic.clinicName,
      clinicId:clinic.clinicId, 
      phoneNo: doctorData.phoneNo,
      confirmPw: doctorData.confirmPw,
      password: doctorData.password,
      emailId: doctorData.emailId,
      lastName: doctorData.lastName,
      firstName: doctorData.firstName,
      specialty: doctorData.specialty,
      //status: offline,
      availableTimings: doctorData.availableTimings
      });
    console.log(doctor, "+++++++++++++")


    if(check==false){
      return {message:" invalid emailId"}
    }else{
      if(!clinic){
        return {message:"clinic not found to register the doctor!"}
      }
      else if(doctors!=null){
        return {message:" emailId already existed! give unique emailId"}
      }
      else{
        await doctor.save();
        return doctor;
      }
    }  

  } catch (error) {
    throw error;
  }
}

async function loginDoctor(doctorData, emailId, password, confirmPw){
  try{
    //console.log(doctorData, emailId, password, confirmPw, "----------------===========")
    const doctors=await Doctor.findOne({emailId:emailId})
    //console.log(doctors, "-------")
    if(doctors==null){
      return {message: " this doctor doesnot have registerd! please go to register before login"}
    }

      const token= Token.generateToken(doctors._id, 'doctor', doctors.emailId, doctors.clinicId)

      const decodedToken=Token.verifyToken(token)
      console.log(doctors, token, decodedToken, "000000000")
      //let flag=false;
      if(password!=confirmPw){
        return {message: "please check the password & confirmPw must be same"}
      }
      else{
        //flag=true
        const state=await Doctor.updateOne(doctors, {$set:{status:"online"}})//doctors.status="online";
       
        return {doctors, token}
      }
      // if(flag){
      //   const state=await Doctor.updateOne(doctors, {$set:{status:"online"}})//doctors.status="online";
      //   return {doctors, token}
      // }

  }catch(err){
    throw err;
  }

}
async function logoutDoctor(emailId){
  try{
    const doctors=await Doctor.findOne({emailId:emailId})
    console.log(doctors, "00000000000")
    const state=await Doctor.updateOne(doctors, {$set:{status:"offline"}})
    console.log(doctors, "00000000000")
    return {doctors};
  }catch(error){
    throw error;
  }

}
async function getDoctorByEmail(emailId) {
  try {
    const doctor = await Doctor.findOne({ emailId });
    return doctor;
  } catch (error) {
    throw error;
  }
}

// Add other doctor services as needed

module.exports = {
  createDoctor,
  getDoctorByEmail,
  loginDoctor,
  logoutDoctor
};