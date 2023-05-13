const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Expense = sequelize.define('expense', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: Sequelize.STRING,
    amount: Sequelize.FLOAT
  });

  return Expense;
};