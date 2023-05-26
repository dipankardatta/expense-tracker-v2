const express = require('express');
require('dotenv').config()
const fs = require('fs')
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Expense = require('../models/expense');
const Order = require('../models/orders')
const forgotPwd = require('../models/forgotpwd')
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

// Import routes
const expenseRoutes = require('../routes/expense');
const userRoutes = require('../routes/user');
const purchaseRoutes = require('../routes/purchase')
const premiumFeatureRoutes = require('../routes/premiumFeature')
const forgotRoutes = require('../routes/forgot')
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(express.json());
app.use(cors());


app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream:accessLogStream}))

// Use routes
app.use('/users', userRoutes);
app.use('/users/expenses', expenseRoutes);
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password',forgotRoutes)




// Define the relationship between User and Expense
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(forgotPwd)
forgotPwd.belongsTo(User)


// Getting request
// app.get('/users/signup', async (req, res) => {
//   const user = await User.findAll();
//   res.json(user);
// });

// Posting request
// app.post('/users/signup', async (req, res) => {
//   const { name, email, password } = req.body;
//   if (name === undefined || name.length === 0 || password == null || password.length === 0 || email == null || email.length === 0) {
//     return res.status(400).json({ err: "BAD PARAMETERS . SOMETHING IS MISSING" })
//   }
//   try {
//     const saltRounds = 10
//     bcrypt.hash(password, saltRounds, async (err, hash) => {
//       await User.create({ name, email, password: hash });
//       res.status(201).json({ message: "SUCCESSFULLY CREATE NEW USER" })
//     })

//   } catch (err) {
//     if (err.name === 'SequelizeUniqueConstraintError') {
//       res.status(400).json({ error: 'Email already exists' });
//     } else {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   }
// });

// Defining a route for the sign-in page
// app.get('/users/signin', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'signin.html'));
// });

// function generateAccessToken(id,name){
//   return jwt.sign({userId: id ,name: name},'4uh32ubeu3h89yfdh38yfbne8cheuw8c9whcwhcuiwhcuiw8ehcs')
// }

// // Defining a route for the sign-in page
// app.post('/users/signin', async (req, res) => {
//   const { email, password } = req.body;

//   if (email == null || email.length === 0 || password == null || password.length === 0) {
//     return res.status(400).json({ err: "BAD PARAMETERS . SOMETHING IS MISSING" })
//   }
//   const user = await User.findOne({ where: { email } });
//   if (user == null) {
//     return res.status(400).json({ err: "USER DOESN'T EXIST" })
//   }

//   bcrypt.compare(password, user.password, function (err, result) {
//     if (err) {
//       return res.status(401).json({ err: "UNAUTHORIZED ACCESS" })
//     }
//     if (result) {
//       const token = generateAccessToken(user.id,user.name)
//       res.status(200).json({accessToken: token});
//     } else {
//       return res.status(401).json({ err: "UNAUTHORIZED ACCESS" })
//     }
//   });
// });

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack)
//   res.status(500).json({ error: 'Internal server error' });
// });


sequelize
// .sync({force: true})
.sync()
.then(res=>{
  // console.log(res)
  app.listen(process.env.PORT || 3000 );
})
.catch(e=>console.log(e))

