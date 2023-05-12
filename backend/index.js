const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt')
const port = 3000;
const { Expense } = require('../database/database');

app.use(express.json());
app.use(cors());
// getting request
app.get('/users/signup', async (req, res) => {
  const expenses = await Expense.findAll();
  res.json(expenses);
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
      await Expense.create({ name, email, password: hash });
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


// Defining a route for handling the sign-in form submission
app.post('/users/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Expense.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        res.status(500).json({ success: false, message: "Something went wrong" })
      }
      if (result === true) {
        res.status(200).json({ success: true, message: 'Logged in successfully' });
      }
      else {
        res.json({ message: 'Password is Incorrect' });
      }
    })

  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log(`Port running on localhost ${port}`)
})