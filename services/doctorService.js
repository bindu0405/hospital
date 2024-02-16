var Doctor = require('../models/doctor');
var Clinic = require('../models/clinicModel')
var Email= require('../lib/validator');
let Token= require('../loaders/jwt');
var WebSocket=require('../lib/websocketcom')


async function createDoctor(doctorData, token) {
  try {
    //const doctor=new Doctor(doctorData)

    let check =Email.validateEmail(doctorData.emailId)
    console.log(doctorData, check, doctorData.emailId, token,  "--------")

    let decodedToken = await Token.verifyToken(token);
      console.log("Decoded Token:", decodedToken);

    let clinic=await Clinic.findById({_id:decodedToken.userId}) 

    let doctors= await Doctor.findOne({emailId:doctorData.emailId}) 
    
    console.log(clinic,clinic.clinicName, clinic.clinicId,  doctors, doctorData, "=============--------")
    
    var doctor = new Doctor({
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
    let doctors=await Doctor.findOne({emailId:emailId})
    if(doctors==null){
      return {message: " this doctor doesnot have registerd! please go to register before login"}
    }

    let token= Token.generateToken(doctors._id, 'doctor', doctors.emailId, doctors.clinicId)
   //const status=await WebSocket.updateDoctorStatus();

    let decodedToken=Token.verifyToken(token)
    //console.log(doctors, token, decodedToken, "000000000")

    if(password!=confirmPw){
      return {message: "please check the password & confirmPw must be same"}
    }
    else{  
      let state=await Doctor.updateOne(doctors, {$set:{status:"online"}})//doctors.status="online" 
      return {doctors, token}
    }
      

  }catch(err){
    throw err;
  }

}
async function logoutDoctor(emailId){
  try{
    let doctors=await Doctor.findOne({emailId:emailId})
    console.log(doctors, "00000000000")
    let state=await Doctor.updateOne(doctors, {$set:{status:"offline"}})
    console.log(doctors, "00000000000")
    return {doctors};
  }catch(error){
    throw error;
  }

}
async function getDoctorByEmail(emailId) {
  try {
    let  doctor = await Doctor.findOne({ emailId });
    return doctor;
  } catch (error) {
    throw error;
  }
}

async function getAllDoctors(emailId) {
  try {
    const page = 1;
    const limit = 2;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < await Doctor.countDocuments().exec()) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = await Doctor.find().limit(limit).skip(startIndex).exec();
    console.log(results,"00000")
    s
    return (results);
    
  } catch (error) {
    throw error;
  }
}


// Add other doctor services as needed

module.exports = {
  createDoctor,
  getDoctorByEmail,
  loginDoctor,
  logoutDoctor, 
  getAllDoctors
};