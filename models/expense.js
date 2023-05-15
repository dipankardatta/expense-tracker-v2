const Sequelize = require('sequelize');
const sequelize = require('../util/database')

  const Expense = sequelize.define('expense', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: Sequelize.STRING,
    amount: Sequelize.FLOAT
  })

  module.exports = Expense