const express = require("express")
const { register, login ,auth,applyDoctor, getAllNotification ,deleteAllNotification,getAllDoctors,bookAppointment,bookingavailbility,userAppointment } = require("../controller/userContoller")
const authMiddleware = require('../middlewares/authMiddleware')
const router = express.Router()



router.post('/register', register)
router.post('/login', login)
router.post('/getUserData' , authMiddleware , auth)

router.post('/apply-doctor' , authMiddleware , applyDoctor)

router.post('/get-all-notification' , authMiddleware,getAllNotification)

router.post('/delete-all-notification' , authMiddleware , deleteAllNotification)

router.get('/getAllDoctors' ,authMiddleware , getAllDoctors)

router.post('/book-appointment' , authMiddleware , bookAppointment)

router.post('/booking-availbility' , authMiddleware , bookingavailbility)

router.post('/user-appointments' , authMiddleware , userAppointment)

module.exports = router
