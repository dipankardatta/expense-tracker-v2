const Sequelize = require('sequelize');
const ExpenseModel = require('../models/expense');

const sequelize = new Sequelize('expense-tracker', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

const Expense = ExpenseModel(sequelize);

sequelize.sync()
  .then(() => {
    console.log('Database and tables created.');
  });

module.exports = {
  Expense
};