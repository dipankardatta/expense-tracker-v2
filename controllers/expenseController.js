const Expense = require('../models/expense');


const getExpenses = async (req, res) => {
  
    Expense.findAll({where: {userId: req.user.id}}).then(expense =>{
        return res.status(200).json({ expense, success:true})
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err,success: false });
    })
};

const createExpense = async (req, res) => {
  try {
    const { name, amount } = req.body;
    const expense = await Expense.create({ name, amount, userId: req.user.id });
    res.json(expense);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id, userId: req.user.id } });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
