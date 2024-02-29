const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')
const { getDoctorInfo,updateDoctor ,getDoctorById , doctorAppointments ,updateStatus} = require('../controller/doctorController')
const router = express.Router()



router.post('/getDoctorInfo' , authMiddleware ,getDoctorInfo )

router.post('/updateDoctor' , authMiddleware , updateDoctor )

router.post('/getDoctorById' , authMiddleware ,getDoctorById)

router.post(
    "/doctor-appointments",
    authMiddleware,
    doctorAppointments
  );

  router.post("/update-status", authMiddleware, updateStatus);


module.exports = router 