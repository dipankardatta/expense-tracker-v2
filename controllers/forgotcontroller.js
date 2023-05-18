const sib = require('sib-api-v3-sdk');
require('dotenv').config();
const client = sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
const User = require('../models/user');
const Forgotpwd = require('../models/forgotpwd');
const bcrypt = require('bcrypt');

apiKey.apiKey = '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';
const tranEmailApi = new sib.TransactionalEmailsApi();

exports.forgotPwd = async (req, res, next) => {
  const email = req.params.email;
  const user = await User.findOne({ where: {email: email } });

  if (user) {
    try {
      const resetToken = await Forgotpwd.create({ userId: user.id, isActive: true });

      const sender = {
        name: 'Dipankar Datta',
        email: 'dipankartomu10@gmail.com',
      };

      const receivers = [
        {
          email,
        },
      ];

      await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Password Reset Link',
        textContent: `http://localhost:3000/password/resetpassword/${resetToken.id}`,
      });

      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error });
    }
  } else {
    return res.status(404).json({ success: false, message: 'User Not Found' });
  }
};
