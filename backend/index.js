const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
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
    const { name, email , password } = req.body;
    if (name === undefined || name.length === 0 || password == null || password.length === 0 || email == null || email.length ===0){
      return res.status(400).json({err: "BAD PARAMETERS . SOMETHING IS MISSING"})
    }
    try {
      const expense = await Expense.create({ name, email, password });
      res.json(expense);
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
  
app.listen(port, () => {
  console.log(`Port running on localhost ${port}`)
})