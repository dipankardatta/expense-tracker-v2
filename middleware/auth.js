const jwt = require('jsonwebtoken')
const User =require('../models/user')

exports.authenticate = (req,res,next)=>{
    try{
        const token = req.header('authorization')
        const user = jwt.verify(token,'secretkey')
        // console.log(user.userId)
        User.findByPk(user.userId).then(user=>{
            req.user=user
            next();
        })
    }
    catch(err){
        console.log(err)
        return res.status(401).json({success:false})
    }
}


// const jwt = require('jsonwebtoken');
// const User = require('../models/user');

// const authenticate = (req, res, next) => {
//   try {
//     const token = req.header('Authorization');
//     const user = jwt.verify(token, '4uh32ubeu3h89yfdh38yfbne8cheuw8c9whcwhcuiwhcuiw8ehcs');
//     User.findByPk(user.userId).then(user => {
//       req.user = user;
//       next();
//     })
//   } catch (err) {
//     console.log(err);
//     return res.status(401).json({ success: false })
//   }
// }

// module.exports = {
//   authenticate
// }



// const jwt = require('jsonwebtoken');
// const User = require('../models/user')

// const authenticate = (req,res,next)=>{
//     try{
//         const token = req.header('Authorization')
//         console.log("token:",token)
//         const user = jwt.verify(token,'4uh32ubeu3h89yfdh38yfbne8cheuw8c9whcwhcuiwhcuiw8ehcs');
//         console.log("userid>>>",user.userId)
//         User.findByPk(user.userId).then(user=>{

//             // console.log(JSON.stringify(user));
//             req.user = user;
//             next();
//         })
//     } catch (err) {
//         console.log(err);
//             return res.status(401).json({success:false})
//     } 
// }
// module.exports = {
//     authenticate
// }