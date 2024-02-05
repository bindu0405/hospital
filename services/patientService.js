const Patient = require('../models/patientModel');
const Token = require('../loaders/jwt');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const Delay = require('../lib/delay')
const mailOptions=require('../lib/sendmail')

var generatedOTP;
var pop;
console.log(Patient, "--------")


   async function registerPatient(patientData) {
    try {
        const patientCount = await Patient.countDocuments();
       generatedOTP = otpGenerator.generate(6, { upperCase: true, specialChars: true, alphabets: true });
        const nextPatientId = patientCount + 1
        const patient=await Patient.findOne({email: patientData.email, phoneNo: patientData.phoneNo})
        if(patient!=null){
          return {message: "email and phoneNo already existed! please give uniqe email and phoneNo"}
        }
        
        const newpatient = new Patient({
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

        //sending email through nodemailer
        const password= mailOptions.generateTemporaryPassword()
        const emailSending= mailOptions.sendTemporaryPassword(password);
         // Replace these values with your Twilio credentials
        const accountSid = "AC9625acd569e43d4bfff5844319ec6f22"     //'YOUR_TWILIO_ACCOUNT_SID';
        const authToken = "67dd8c44ce914c0ea803d38de2c87af7";
        //const serviceSid =  "VAdd639396b7f254bb87086e35b541bf16"

        const twilioPhoneNumber ='+12059272986';
        const client = new twilio(accountSid, authToken);
        console.log(accountSid, authToken, twilioPhoneNumber, client, "=======")

       // In-memory storage for generated OTPs (replace with a database in production)
      const otpStorage = new Map()
           
      // Store the OTP in memory (replace with a database in production)
      otpStorage.set(patientData.phoneNo, generatedOTP);
      console.log(patientData.phoneNo, twilioPhoneNumber, generatedOTP, otpStorage, "========")
      const mobileNo=patientData.phoneNo;
      // Send the OTP via Twilio SMS
      await newpatient.save();
      let countryCode=91;
      const delayTime=  Delay.retryWithExponentialBackoff;
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
    const accountSid = "AC9625acd569e43d4bfff5844319ec6f22"; // Replace with your Twilio Account SID
    const authToken = "67dd8c44ce914c0ea803d38de2c87af7"; // Replace with your Twilio Auth Token
    const client = new twilio(accountSid, authToken);

    const verificationSid = patientData.sid;

    console.log(verificationSid, patientData.sid,"==============");
    //const delayTime=  Delay.retryWithExponentialBackoff;

    const verification = await client.verify.v2
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
      const patients=await Patient.findOne({email:email, phoneNo:phoneNo})
      console.log(patients, "-------")
      if(patients==null){
        return {message: " this patient doesnot have registerd! please go to register before login"}
      }
        const token= Token.generateToken(patients._id, 'patient', patients.email, patients.patientId)
  
        const decodedToken=Token.verifyToken(token)
        console.log( token, decodedToken, generatedOTP, otp,  "000000000")
        // if(passwords!=true){
        //    return {message: "please check the password! it is incorrect password "}
        // }
        // else{
          

          // Retrieve the stored OTP associated with the user's session or user ID
        
          // Compare the entered OTP with the stored OTP
          if (generatedOTP === otp) {
            // OTP is valid, proceed with user registration
            return ({ success: true, token:token, message: 'OTP verified successfully' });
          } else {
            // Invalid OTP
            return ({ success: false, message: 'Invalid OTP' });
          }        
          //return {patients, token}
        //}
  
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