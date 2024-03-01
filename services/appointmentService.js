let Appointment = require('../models/appointmentModel');
let Doctor= require('../models/doctor')
let Patient= require('../models/patientModel')
let Token= require('../loaders/jwt') 
let websocket= require('../lib/websocketcom')
//let noti= require('../lib/sendnotification')

async function doctorsData(req, res){
  try{
    let appointment = new Doctor(req.params);
    let doctors=await Doctor.find()
   // let notify=await noti.notification(doctors);
    //console.log(notify, "===========")
    let map=websocket.io;
   // console.log(map, "========----------")
    
    console.log( doctors,  "==========")
    res.status(201).json(doctors)
  }catch(err){
    throw err;
  }
}

// Service to create a new appointment

async function createAppointment(req, res) {
  try {
    let appointment = new Appointment(req.body);

    // Fetch doctor details
    let doctor = await Doctor.findOne({ _id: appointment.doctorId });
    console.log(doctor, "----------");

    // Verify authorization token
    let bearerHeader = req.headers['authorization'];
    if (!bearerHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    var token = bearerHeader.replace('Bearer ', '');
    var decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken, decodedToken.email);

    // Fetch patient details
    var patient = await Patient.findOne({ email: decodedToken.email });
    console.log(patient, "===");

    // Check if the appointment is for the authenticated patient
    if (decodedToken.email === appointment.patientEmail) {
      // Check if the new appointment starts after the previous appointment ends
      var previousAppointment = await Appointment.findOne({ doctorId: appointment.doctorId }).sort({ endTime: -1 });
      console.log(previousAppointment, "00000888888666666")
      if (previousAppointment && appointment.startTime <= previousAppointment.endTime) {
        return res.status(400).json({ message: 'New appointment must start after the previous appointment ends.' });
      }
      let savedAppointment = await appointment.save();
      res.status(201).json({ savedAppointment, doctor, patient });
    } else {
      res.status(403).json({ message: "Invalid patient credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
}

// the next  appointment StartTime should be starts after the before apoointment endTime

async function getAllDoctorAppointments(req, res) {
  try {
    var token;
    let bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      token = bearerHeader.replace('Bearer ', '');
    }

    let decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken, decodedToken.email);
    let appointments = await Appointment.find({ doctorId: decodedToken.userId });
    const mails = appointments.map(obj => obj.patientEmail);
    console.log(appointments, mails, "--------------")
    var Array = [];

    for (let i = 0; i < appointments.length; i++) {
      const doctor = await Doctor.findOne({ emailId: decodedToken.email });

      if (appointments[i].doctorId == doctor._id) {
        const doctorDetails = {
          doctorId: doctor._id,
          email: doctor.emailId,
          clinicName: doctor.clinicName,
          specialty: doctor.specialty,
        }

        console.log(doctorDetails, appointments[i].doctorId, doctor._id, "============")
        const patient = await Patient.find({ email: mails });

        for (let j = 0; j < patient.length; j++) {
          if (appointments[i].patientEmail == patient[j].email) {
            const patientDetails = {
              patientId: patient[j].patientId,
              firstName: patient[j].firstName,
              lastName: patient[j].lastName,
              age: patient[j].age,
              email: patient[j].email,
              phoneNo: patient[j].phoneNo
            }

            console.log(patientDetails, appointments[i].patientEmail, patient[j].email)

            // Check for duplicate patient before pushing into Array
            const isDuplicatePatient = Array.some(item =>
              item.patientData.patientId === patientDetails.patientId
            );

            if (!isDuplicatePatient) {
              const appointment = {
                doctorData: doctorDetails,
                patientData: patientDetails,
                startTime: appointments[i].startTime,
                endTime: appointments[i].endTime,
                status: appointments[i].status
              }

              console.log(appointment, "++++++")
              Array.push(appointment);
            }
          }
        }
      }
    }
    res.status(201).json(Array);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

async function getAllPatientAppointments(req, res){
  try{
    var token;
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     token = bearerHeader.replace('Bearer ', '');
    }

    var decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken, decodedToken.email);
    const appointment=await Appointment.find({patientEmail:decodedToken.email})
    const email = appointment.map(obj => obj.patientEmail);
    const patient = await Patient.findOne({email:email})
       
    console.log(email, appointment, patient,"==========")
    var appointments=[]
    for(i=0;i<appointment.length;i++){
      if(appointment[i].patientEmail==patient.email){
        const patientData = {
          patientId: patient.patientId,
          firstName: patient.firstName,
          lastName: patient.lastName,
          age: patient.age,
          email: patient.email,
          phoneNo: patient.phoneNo
        }
        console.log(patientData, appointment[i].patientEmail, patient.email, "++++++++++++++++")
      
        const doctorId = appointment.map(obj=> obj.doctorId )
        var doctor=await Doctor.find({_id:doctorId})
        for(j=0;j<doctor.length;j++){
          if(appointment[i].doctorId==doctor[j]._id){
            const doctorData = {
              doctorId: doctor[j]._id,
              email: doctor[j].emailId,
              clinicName: doctor[j].clinicName,
              specialty: doctor[j].specialty,
            }
            console.log(doctorData, appointment[i].doctorId, doctor[j]._id)  
          
            const arr={
              patient:patientData,
              doctor:doctorData,
              startTime:appointment[i].startTime,
              endTime:appointment[i].endTime
            }
            appointments.push(arr)
          }
        }
      }
    }

    function removeDuplicatesWithSet(arr) {
      return Array.from(new Set(arr.map(JSON.stringify))).map(JSON.parse);
  }
  const uniqueArray = removeDuplicatesWithSet(appointments, "patient");
  console.log(uniqueArray);
    res.status(201).json(uniqueArray);
      
  }catch(err){
    res.status(500).json({ err: err.message });
  }
}

async function confirmAppointment(req, res){
  console.log("==========")
  try{
    const appointments= req.body;
    var token;
    var bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     token = bearerHeader.replace('Bearer ', '');
    }

    var decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken, decodedToken.email);
    var appointment = await Appointment.findOne({_id:appointments.appointmentId});
    console.log(appointment, "------------")
    if(decodedToken.userId!=appointment.doctorId){
      throw new Error('invaild doctor credentials');
    }
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'completed') {
      throw new Error('Appointment is already confirmed');
    }

    appointment.status = 'completed';
    const updatedAppointment = await appointment.save();

    res.status(500).json({updatedAppointment})

  }catch(err){
    res.status(500).json({err:err.message})
  }
}

async function cancelAppointment(req, res){
  try{ 
    var appointments= req.body;
    var token;
    var bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
     token = bearerHeader.replace('Bearer ', '');
    }

    var decodedToken = await Token.verifyToken(token);
    console.log("Decoded Token:", decodedToken, decodedToken.email);
    let appointment = await Appointment.findOne({_id:appointments.appointmentId});
    console.log(appointment, "------------")
    if(decodedToken.email!=appointment.patientEmail){
      throw new Error('invaild patient credentials');
    }
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (appointment.status === 'canceled') {
      throw new Error('Appointment is already canceled');
    }

    appointment.status = 'canceled';
    const updatedAppointment = await appointment.save();

    res.status(500).json({updatedAppointment})

  }catch(err){
    res.status(500).json({err:err.message})
  }
}

// Service to update an appointment by ID
async function updateAppointment(req, res) {
  try {
    let updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      req.body,
      { new: true }
    );
    if (updatedAppointment) {
      res.status(200).json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Service to delete an appointment by ID
async function deleteAppointment(req, res) {
  try {
    let deletedAppointment = await Appointment.findByIdAndDelete(req.params.appointmentId);
    if (deletedAppointment) {
      res.status(200).json({ message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createAppointment,
  doctorsData,
  getAllDoctorAppointments,
  getAllPatientAppointments,
  confirmAppointment,
  cancelAppointment,
  updateAppointment,
  deleteAppointment,
};
