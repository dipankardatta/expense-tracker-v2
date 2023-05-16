const Razorpay = require('razorpay');
const Order = require('../models/orders')
const userController = require('../controllers/userController')
const User = require('../models/user')
require('dotenv').config()

exports.purchasepremium = async (req, res,next) => {
    try {
        var rzp = new Razorpay({
            key_id: 'rzp_test_IyfQErT959Lg2Y',
            key_secret: `ngT6bZuSA5lk3d9Y4MO0yxPa`
        })
        const amount = 2500

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err))
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id }) // updating
            })
            })
        }
    catch (err) {
        console.log(err)
        res.status(403).json({ message: 'something went wrong', error: err })
    }
}

exports.updateTransactionStatus = async (req, res,next) => {
    try {
        
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } });
        const promise1 = order.update({ paymentid: payment_id, status: "SUCCESSFUL" });
        const promise2 = req.user.update({ ispremiumuser: true });

        Promise.all([promise1, promise2]).then(() => {
            const userId = req.user.id
            const token = userController.generateAccessToken(userId, undefined , true);
            return res.status(202).json({ success: true, message: "Transaction Successful" , token });
        }).catch((error) => {
            throw new Error(error);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


