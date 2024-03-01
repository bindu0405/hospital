const  Doctor = require('../models/doctor');
const Clinic = require('../models/clinicModel')
const Email= require('../lib/validator');
const Token= require('../loaders/jwt');
//const WebSocket=require('../lib/websocketcom');
const { MongoClient } = require('mongodb');

let uri = 'mongodb://localhost:27017/appointment_system';
let databaseName = 'appointment_system';
let doctorCollection = 'doctors';
let clinicCollection = 'clinics';


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

async function getAllDoctors(req, res) {
  try {

    
    var client = await MongoClient.connect(uri);
    let db = client.db(databaseName);
    let alldoctors = db.collection(doctorCollection);
    console.log(alldoctors, "00099888")
    
    let result = await alldoctors.aggregate([
      { $match: { clinicName: 'rk' } },
     // { $sort: { clinicId: -1 } },
      { $skip:parseInt(req.query.page)*parseInt(req.query.size) },
      { $limit: parseInt(req.query.size) },
      { $sort: { clinicId: -1 } },
      //{ $project: { clinicName: 'rkkloll', firstName: 'john', lastName: 'peter',emailId: 'll@gail.com',specialty: [ 'ortho' ] }}
    ]).toArray();

    console.log("Aggregation result:", result);
    res.json(result); 
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ "error": error }); 
  }
}

async function mapTwoCollections() {
  try {
    var client = await MongoClient.connect(uri);
    console.log("Connected to MongoDB successfully");
    let db = client.db(databaseName);
  
    let alldoctors = db.collection(doctorCollection);
    let allclinics = db.collection(clinicCollection);

    // Perform aggregation to map doctors with clinics
    const result = await allclinics.aggregate([
      { $match: { clinicName: "rkkloll" }},
      {
        $lookup: {
          from: "doctors",
          localField: "clinicName",
          foreignField: "clinicName",
          as: "doctors"
        }
      },
      {
        $unwind: { path: "$doctors", preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
            _id: "6579821819c66279900ccf04", // Group by clinic ID
          clinicName: { $last: "$clinicName" },
          //clinicId: { $addToSet: "$clinicId" },
          doctors: { $addToSet: "$doctors" }
        }
      }
    ]).toArray();
    
    console.log("Mapped result:", result);
    return result;
  } catch (error) {
    console.error("Error mapping collections:", error);
    throw error;
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log("Disconnected from MongoDB");
    }
  }
}

module.exports = {
  createDoctor,
  getDoctorByEmail,
  loginDoctor,
  logoutDoctor, 
  getAllDoctors,
  mapTwoCollections
};