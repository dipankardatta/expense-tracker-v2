const express = require('express');
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/orders')
const forgotPwd = require('./models/forgotpwd')
const jwt = require('jsonwebtoken');
const sequelize = require('./util/database')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

// Import routes
const expenseRoutes = require('./routes/expense');
const userRoutes = require('./routes/user');
const purchaseRoutes = require('./routes/purchase')
const premiumFeatureRoutes = require('./routes/premiumFeature')
const forgotRoutes = require('./routes/forgot')
const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})

app.use(express.json());
app.use(cors());


// app.use(helmet())
// app.use(compression())
// app.use(morgan('combined',{stream:accessLogStream}))

// Use routes
app.use('/users', userRoutes);
app.use('/users/expenses', expenseRoutes);
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeatureRoutes)
app.use('/password',forgotRoutes)

app.use((req,res)=>{
  console.log('urlll',req.url);
  res.sendFile(path.join(__dirname,`public/${req.url}`))
})

// Define the relationship between User and Expense
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(forgotPwd)
forgotPwd.belongsTo(User)



sequelize
// .sync({force: true})
.sync()
.then(res=>{
  app.listen(process.env.PORT || 4000 );
})
.catch(e=>console.log(e))

