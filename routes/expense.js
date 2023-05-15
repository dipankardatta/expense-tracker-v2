const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const userauthentication = require('../middleware/auth');

// GET all expenses
router.get('/', userauthentication.authenticate , expenseController.getExpenses);

// POST a new expense
router.post('/',userauthentication.authenticate, expenseController.createExpense);

// DELETE an expense by ID
router.delete('/:id', userauthentication.authenticate,expenseController.deleteExpense);

module.exports = router; 