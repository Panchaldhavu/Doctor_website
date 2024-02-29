const user = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/DoctorModel')
const appointmentModel = require('../models/appointmentModel')
const moment = require('moment')



const register = async (req, res) => {
    try {
        const exisitingUser = await user.findOne({ email: req.body.email })

        if (exisitingUser) {
            return res
                .status(200)
                .send({ message: "User Already Exist", success: false });
        }

        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        req.body.password = hashPassword
        const USER = new user(req.body)
        await USER.save()
        res.status(201).send({ message: "Register Successfully", success: true })



    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `error in register ${error.message}` })
    }
}



const login = async (req, res) => {
    try {
        const USER = await user.findOne({ email: req.body.email })
        if (!USER) {
            return res.status(200).send({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(req.body.password, USER.password)
        if (!isMatch) {
            return res.status(200).send({ success: false, message: 'Invalid Email or Password' })
        }

        const token = jwt.sign({ id: USER._id }, process.env.JWT_SECRETE, { expiresIn: '1d' });


        res.status(200).send({ success: true, message: "Login Successfully", token })


    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: `error in Login ${error.message}` })
    }
}

const auth = async (req, res) => {
    try {
        const USER = await user.findById({ _id: req.userId });

        if (!USER) {
            return res.status(200).send({
                message: "user not found",
                success: false,
            });
        } else {
            res.status(200).send({
                success: true,
                data: USER,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "auth error",
            success: false,
            error,
        });
    }
};


const applyDoctor = async (req, res) => {
    try {
        const newDoctor = await doctorModel({ ...req.body, status: "pending" })
        await newDoctor.save()

        const adminUser = await user.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: "apply-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: "/admin/docotrs",
            }
        })
        await user.findByIdAndUpdate(adminUser._id, { notification });
        res.status(201).send({
            success: true,
            message: "Doctor Account Applied SUccessfully",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Erro whiling Applying Doctor", error })
    }
}


const getAllNotification = async (req, res) => {
    try {
        const USER = await user.findOne({ _id: req.body.userId })
        const seennotification = USER.seennotification
        const notification = USER.notification
        seennotification.push(...notification)
        USER.notification = []
        USER.seennotification = notification
        const UpdateUser = await USER.save()
        res.status(200).send({
            success: true,
            message: 'All notification marked as read',
            data: UpdateUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Error in notification', error })
    }
}


const deleteAllNotification = async (req, res) => {
    try {
        const USER = await user.findOne({ _id: req.body.userId })
        USER.notification = []
        USER.seennotification = []
        const UpdateUser = await USER.save()
        UpdateUser.password = undefined
        res.status(200).send({
            success: true,
            message: 'Notification delete Successfully',
            data: UpdateUser
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'unable to delete all notification', error })
    }
}


const getAllDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({ status: "approved" })
        res.status(200).send({
            success: true,
            data: doctors,
            message: 'Doctors fetch successfully'
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'unable to fetch Doctors', error })
    }
}




const bookAppointment = async (req, res) => {
    try {
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        req.body.status = 'pending'
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const USER = await user.findOne({ _id: req.body.doctorInfo.userId })
        USER.notification.push({
            type: "New-appointment-request",
            message: `A nEw Appointment Request from ${req.body.userInfo.name}`,
            onCLickPath: "/user/appointments",
        });
        await USER.save()
        res.status(200).send({
            success: true,
            message: "Appointment Book successfully",

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Erro while booking Appointment', error })
    }
}


const bookingavailbility = async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: {
                $gte: fromTime,
                $lte: toTime,
            },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not Availibale at this time",
                success: true,
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Appointments available",
            });
        }

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Erro in booking', error })
    }
}



const userAppointment = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({
            userId: req.body.userId,
        });
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch SUccessfully",
            data: appointments,
        });

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Error In User Appointments', error })
    }
}



module.exports = { login, register, auth, applyDoctor, getAllNotification, deleteAllNotification, getAllDoctors, bookAppointment, bookingavailbility, userAppointment }