const express = require('express')
const resetpasswordController = require('../controllers/forgotcontroller')
const router = express.Router()


router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatePwd)

router.get('/resetpassword/:id', resetpasswordController.resetPwd)

router.use('/forgotpassword', resetpasswordController.forgotPwd);

module.exports = router;