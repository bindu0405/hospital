const Clinic = require('../models/clinicModel');
const Token =require('../loaders/jwt')
const Admin = require('../models/adminModel')
const Email = require('../lib/validator');
const sendmail = require('../lib/sendmail');
let noti= require('../lib/sendnotification')



async function registerClinic(clinicData,token) {    //token is nothing but req.token, pop=req.token
  try {
    const decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken);
  
    let admin = await Admin.findById({_id:decodedToken.userId})
    console.log( admin,admin.emailId,  "+++++++++++++admin admin")
   
   
   const { MongoClient } = require('mongodb');
   
   let uri = 'mongodb://localhost:27017/appointment_system';
   let databaseName = 'appointment_system';
   let collectionName = 'clinics';
   
  // Connect to MongoDB
MongoClient.connect(uri)
.then(client => {
  console.log("Connected to MongoDB successfully");
  var db = client.db(databaseName);
  var collection = db.collection(collectionName);

  // Perform aggregation
  return collection.aggregate([
    // Your aggregation pipeline stages here
    //{ $group: {  _id: "$clinicName",  total: {$sum: "$clinics" }} }
    { $unwind: "$timings" }, // Deconstruct the items array => it seperates an arr in an arr or arr of obj.

    { $match: { clinicName: "rkkloll" } },
    {$sort: { clinicId: -1 } }, 
    
    { $limit: 3} , 
  ]).toArray();
  
})
.then(result => {
  console.log("Aggregation result:", result);
})
.catch(error => {
  console.log("Error during aggregation:", error);
});
  let clinics=await Clinic.findOne({clinicId:clinicData.clinicId});
  let email= await Clinic.findOne({clinicEmail:clinicData.clinicEmail}) 

  try {  
    if(admin!=null){
      if(clinics!=null){
        return {message:" clinicId already existed"}
      }
      else if(email!=null){
        return {message: " emailId alreay existed! give uniqe emailId"}
      }  
      else{
        //send email
            //let password = sendmail.generateTemporaryPassword();
            //clinicData.password = password;
             const clinic= new Clinic(clinicData);
             await clinic.save();
          //let emailSending= sendmail.sendTemporaryPassword( password)

         let notify=await noti.sendNotificationAndEmail(sendmail);
         console.log(notify,  "0---")
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
    let clinics = await Clinic.findOne({clinicId:clinicId})
   
    // Generate JWT token
    let token = Token.generateToken(clinics._id,'clinic',clinics.email, clinics.clinicId); 
      console.log(clinics, token ,"888888888888")

      let decodedToken = await Token.verifyToken(token);
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
