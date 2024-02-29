const USER = require('../models/userModel')
const DOCTORS = require('../models/DoctorModel')

const getAllUsers = async (req, res) => {
    try {
        const users = await USER.find({})
        res.status(200).send({
            success: true,
            message: 'User List',
            data: users
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching users",
            error
        })

    }
}



const getAllDoctors = async (req, res) => {
    try {
        const doctors = await DOCTORS.find({})
        res.status(200).send({
            success: true,
            message: 'Doctors List',
            data: doctors
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching users",
            error
        })
    }
}


const changeAccountStatus = async (req, res) => {
    try {
        const { doctorId, status } = req.body
        const doctor = await DOCTORS.findByIdAndUpdate(doctorId, { status })
        const user = await USER.findOne({ _id: doctor.userId })
        const notification = user.notification
        notification.push({
            type: "doctor-account-request-updated",
            message: `Your Doctor Account Request Has ${status} `,
            onClickPath: "/notification",
        });
        user.isDoctor = status === 'approved' ? true : false
        await user.save()
        res.status(201).send({
            success:true ,
            message:'Account Status Update',
            data:doctor
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Account Status",
            error
        })
    }
}


module.exports = {
    getAllUsers,
    getAllDoctors,
    changeAccountStatus
}