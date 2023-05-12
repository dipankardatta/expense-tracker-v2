const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Expense = sequelize.define('expense', {
    name: Sequelize.STRING,
    amount: Sequelize.FLOAT
  });

  return Expense;
};
