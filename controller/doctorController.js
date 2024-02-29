const DOCTOR = require('../models/DoctorModel')
const appointmentModel = require('../models/appointmentModel')
const userModel = require('../models/userModel')



const getDoctorInfo = async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'Doctor data fetch successfully',
            data: doctor
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in fetching Doctor detail',
            error
        })
    }
}



const updateDoctor = async (req, res) => {
    try {
        const doctor = await DOCTOR.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(200).send({
            success: true,
            data: doctor,
            message: "Profile Update"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Update Profile detail',
            error
        })
    }
}



const getDoctorById = async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: "Single Doctor fetche successfully",
            data: doctor
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in getting Doctor information',
            error
        })
    }
}


const doctorAppointments = async (req, res) => {
    try {
        const doctor = await DOCTOR.findOne({ userId: req.body.userId });
        const appointments = await appointmentModel.find({
            doctorId: doctor._id,
        });
        res.status(200).send({
            success: true,
            message: "Doctor Appointments fetch Successfully",
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Doc Appointments",
        });
    }
}


const updateStatus = async (req,res)=>{
    try {
        const { appointmentsId, status } = req.body;
        const appointments = await appointmentModel.findByIdAndUpdate(
          appointmentsId,
          { status }
        );
        const user = await userModel.findOne({ _id: appointments.userId });
        const notifcation = user.notification;
        notifcation.push({
          type: "status-updated",
          message: `your appointment has been updated ${status}`,
          onCLickPath: "/doctor-appointments",
        });
        await user.save();
        res.status(200).send({
          success: true,
          message: "Appointment Status Updated",
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          error,
          message: "Error In Update Status",
        });
      }
}


module.exports = {
    getDoctorInfo,
    updateDoctor,
    getDoctorById,
    doctorAppointments,
    updateStatus
}