const sib = require('sib-api-v3-sdk');
require('dotenv').config();

const User = require('../models/user');
const Forgotpwd = require('../models/forgotpwd');
const bcrypt = require('bcrypt');
// const uuid = require('uuid')
// const sgMail = require('@sendgrid/mail')



exports.forgotPwd = async (req, res, next) => {
    const email = req.params.email;
    console.log(email)
    const user = await User.findOne({ where: { email } });
    if (user) {
        try {
            
            const resetToken = await Forgotpwd.create({ userId: user.id, isActive: true });
            const client = sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = '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';

            const tranEmailApi = new sib.TransactionalEmailsApi();

            const sender = {
                name: 'Dipankar Datta',
                email: 'dipankartomu10@gmail.com',
            };
            const receivers = [
                {
                    email: email,
                },
            ];
            tranEmailApi.sendTransacEmail({
                sender,
                to: receivers,
                subject: 'Password Reset Link',
                textContent: `http://localhost:3000/password/resetpassword/${resetToken.id}`,
            }).then(console.log).catch(console.log)
            return res.status(201).json({ success: true });
        } catch (error) {
            return res.status(500).json({ success: false, error });
        }
    } else {
        return res.status(404).json({ success: false, message: 'User Not Found' });
    }
};

// exports.forgotPwd = async (req, res) => {
//   try {
//       const { email } =  req.body;
//       const user = await User.findOne({where : { email }});
//       if(user){
//           const id = uuid.v4();
//           user.createforgotpwd({ id , active: true })
//               .catch(err => {
//                   throw new Error(err)
//               })

//           sgMail.setApiKey(process.env.SENGRID_API_KEY)

//           const msg = {
//               to: email, // Change to your recipient
//               from: 'dipankartomu10@gmail.com', // Change to your verified sender
//               subject: 'Sending with SendGrid is Fun',
//               text: 'and easy to do anywhere, even with Node.js',
//               html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
//           }

//           sgMail
//           .send(msg)
//           .then((response) => {
//               return res.status(response[0].statusCode).json({message: 'Link to reset password sent to your mail ', sucess: true})

//           })
//           .catch((error) => {
//               throw new Error(error);
//           })

//           //send mail
//       }else {
//           throw new Error('User doesnt exist')
//       }
//   } catch(err){
//       console.error(err)
//       return res.json({ message: err, success: false });
//   }

// }

exports.resetPwd = (req, res) => {
    const id = req.params.id
    Forgotpwd.findOne({ where: { id } }).then(forgotpasswordrequest => {
        if (forgotpasswordrequest.isActive) {
            forgotpasswordrequest.update({ isActive: false });
            res.status(200).send(`<html>
                                  <script>
                                      function formsubmitted(e){
                                          e.preventDefault();
                                          console.log('called')
                                      }
                                  </script>
                                  <form action="/password/updatepassword/${id}" method="get">
                                      <label for="newpassword">Enter New password</label>
                                      <input name="newpassword" type="password" required></input>
                                      <button>reset password</button>
                                  </form>
                              </html>`)
            res.end()
        }
        else return res.status(500).json({ message: "LINK EXPIRED BUDDY" })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: err })
    })
}
exports.updatePwd = async (req, res, next) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpwd.findOne({ where: { id: resetpasswordid } }).then(resetpasswordrequest => {
            User.findOne({ where: { id: resetpasswordrequest.userId } }).then(user => {
                // console.log('userDetails', user)
                if (user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function (err, hash) {
                            // Store hash in your password DB.
                            if (err) {
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                resetpasswordrequest.update({ isActive: false }).then(() => res.status(201).json({ message: 'Successfuly update the new password' }))
                            })
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user Exists', success: false })
                }
            })
        })
    } catch (error) {
        return res.status(403).json({ error, success: false })
    }
}


