const Patient = require('../models/patientModel');
const Token = require('../loaders/jwt');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const Delay = require('../lib/delay')
const mailOptions=require('../lib/sendmail')

var generatedOTP;
console.log(Patient, "--------")


   async function registerPatient(patientData) {
    try {
        let patientCount = await Patient.countDocuments();
       generatedOTP = otpGenerator.generate(6, { upperCase: true, specialChars: true, alphabets: true });
        let nextPatientId = patientCount + 1
        let patient=await Patient.findOne({email: patientData.email, phoneNo: patientData.phoneNo})
        if(patient!=null){
          return {message: "email and phoneNo already existed! please give uniqe email and phoneNo"}
        }
        
        let newpatient = new Patient({
          patientId:nextPatientId,
          firstName:patientData.firstName,
          lastName:patientData.lastName,
          age:patientData.age,
          email:patientData.email,
          phoneNo:patientData.phoneNo,
          dateOfBirth:patientData.dateOfBirth,
          password: patientData.hashedPassword,
          profilePhoto:patientData.profilePhoto,
         verified:patientData.verified,
          role:patientData.role

        });

        
        let password= mailOptions.generateTemporaryPassword()
        let emailSending= mailOptions.sendTemporaryPassword(password);
         
        let accountSid = "AC9625acd569e43d4bfff5844319ec6f22"     //'YOUR_TWILIO_ACCOUNT_SID';
        var authToken = "67dd8c44ce914c0ea803d38de2c87af7";
        

        var twilioPhoneNumber ='+12059272986';
        var client = new twilio(accountSid, authToken);
        console.log(accountSid, authToken, twilioPhoneNumber, client, "=======")

       
      var otpStorage = new Map()
      
      otpStorage.set(patientData.phoneNo, generatedOTP);
      console.log(patientData.phoneNo, twilioPhoneNumber, generatedOTP, otpStorage, "========")
      var mobileNo=patientData.phoneNo;
      
      await newpatient.save();
      let countryCode=91;
      var delayTime=  Delay.retryWithExponentialBackoff;
      let otpResponse = client.verify.v2.services("VAdd639396b7f254bb87086e35b541bf16").verifications
      .create({to:`+${countryCode}${patientData.phoneNo}`,channel:"sms"})
      //.create({ body: `Your OTP is: ${generatedOTP}`, channel: 'sms',from: twilioPhoneNumber,  to: mobileNo,})
      console.log(otpResponse, "====================================");
      return {message:"registered"+JSON.stringify(otpResponse)}

    } catch (error) {
      throw new Error(`Error creating patient: ${error.message}`);
    }
  }
  
async function verifyOTP(patientData) {
  try {
    var accountSid = "AC9625acd569e43d4bfff5844319ec6f22"; 
    var authToken = "67dd8c44ce914c0ea803d38de2c87af7"; 
    var client = new twilio(accountSid, authToken);

    var verificationSid = patientData.sid;

    console.log(verificationSid, patientData.sid,"==============");
    //const delayTime=  Delay.retryWithExponentialBackoff;

    var verification = await client.verify.v2
      .services("VAdd639396b7f254bb87086e35b541bf16")
      .verificationChecks
      .create({
        to: patientData.phoneNo,
        code: patientData.otp,
      })
     
     console.log(verification, "--------------")

    console.log("Verification Status:", verification.status);

    if (verification.status === "approved" && verification.valid) {
      return ("Verification is approved and valid!");
    } else {
      return ("Verification is not approved or not valid.");
    }

  } catch (error) {
    if (error.code === 60201) {
      console.log('Max send attempts reached. Resend the verification code.');
    } else {
      console.error('Error verifying OTP:', error.message);
    }
    return false;
  }
}
  
  async function loginPatient(patientData, email, otp, phoneNo){
    try{
      console.log(patientData, email, otp, phoneNo, "----------------===========")
      var patients=await Patient.findOne({email:email, phoneNo:phoneNo})
      console.log(patients, "-------")
      if(patients==null){
        return {message: " this patient doesnot have registerd! please go to register before login"}
      }
        var token= Token.generateToken(patients._id, 'patient', patients.email, patients.patientId)
  
        var decodedToken=Token.verifyToken(token)
        console.log( token, decodedToken, generatedOTP, otp,  "000000000")
       return ({token, patientData})
    }catch(err){
      throw err;
    }
  
  }
  

  async function getPatientById(patientId) {
    try {
      return await Patient.findById(patientId);
    } catch (error) {
      throw new Error(`Error retrieving patient: ${error.message}`);
    }
  }

  // Add more service methods as needed (update, delete, list, etc.)


module.exports = {
    registerPatient:registerPatient,
    getPatientById:getPatientById,
    verifyOTP:verifyOTP,
    loginPatient:loginPatient
  
};