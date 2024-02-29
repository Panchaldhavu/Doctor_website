const express = require("express")
const authMiddleware = require('../middlewares/authMiddleware')
const { getAllUsers, getAllDoctors,changeAccountStatus } = require("../controller/adminController")
const router = express.Router()


router.get('/getAllUsers' , authMiddleware , getAllUsers)
router.get('/getAllDoctors' ,authMiddleware ,getAllDoctors)

router.post('/changeAccountStatus' , authMiddleware ,changeAccountStatus)


module.exports = router