const express = require('express')
const router = express.Router()
const purchaseController = require('../controllers/purchaseController')
const authenticatemiddleware = require('../middleware/auth')

router.get('/premiummembership', authenticatemiddleware.authenticate, purchaseController.purchasepremium)

router.post('/updatestatus', authenticatemiddleware.authenticate, purchaseController.updateTransactionStatus)

module.exports = router
