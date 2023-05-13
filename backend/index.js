const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')
const port = 3000;
const { User } = require('../database/database');
const { Expense } = require('../database/database');
const jwt = require('jsonwebtoken')
const userauthentication = require ('../middleware/auth')



app.use(express.json());
app.use(cors());


// Define the relationship between User and Expense
// User.hasMany(Expense);
// Expense.belongsTo(User);

// getting request
app.get('/users/signup', async (req, res) => {
  const user = await User.findAll();
  res.json(user);
});

// posting request
app.post('/users/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (name === undefined || name.length === 0 || password == null || password.length === 0 || email == null || email.length === 0) {
    return res.status(400).json({ err: "BAD PARAMETERS . SOMETHING IS MISSING" })
  }
  try {
    const saltRounds = 10
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await User.create({ name, email, password: hash });
      res.status(201).json({ message: "SUCCESSFULLY CREATE NEW USER" })
    })

  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
// Defining a route for the sign-in page
// Defining a route for the sign-in page
app.get('/users/signin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'signin.html'));
});

function generateAccessToken(id,name){
  return jwt.sign({userId: id ,name: name},'4uh32ubeu3h89yfdh38yfbne8cheuw8c9whcwhcuiwhcuiw8ehcs')
}


// Defining a route for handling the sign-in form submission
app.post('/users/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ success: false, message: "Something went wrong" })
      }
      if (result === true) {
        res.status(200).json({ success: true, message: 'Logged in successfully',token: generateAccessToken(user.id, user.name) });
      }
      else {
        res.json({ message: 'Password is Incorrect' });
      }
    })

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// EXPENSE LIST //


app.get('/users/expenses', userauthentication.authenticate, async (req, res) => {
  const expenses = await Expense.findAll({
    where: {
      userId: req.user.id
    }
  });
  res.json(expenses);
});
// Add a new expense
app.post('/users/expenses', async (req, res) => {
  const { name, amount } = req.body;
  const expense = await Expense.create({ name, amount });
  res.json(expense);
});

// Delete an expense by id
app.delete('/users/expenses/:id', async (req, res) => {
  const { id } = req.params;
  await Expense.destroy({ where: { id } });
  res.sendStatus(204);
});


app.listen(port, () => {
  console.log(`Port running on localhost ${port}`)
})



