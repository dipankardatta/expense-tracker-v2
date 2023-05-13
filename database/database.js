const Sequelize = require('sequelize');
const userModel = require('../models/user');
const expenseModel = require('../models/expense');

const sequelize = new Sequelize('exp_tracker', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = userModel(sequelize, Sequelize);
const Expense = expenseModel(sequelize, Sequelize);

User.hasMany(Expense);
Expense.belongsTo(User);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database and tables created.');
  })
  .catch((error) => {
    console.log('Error syncing the database: ', error);
  });

module.exports = {
  User,
  Expense
};


// const Sequelize = require('sequelize');
// const userModel = require('../models/user');

// const sequelize = new Sequelize('user', 'root', '123456', {
//   host: 'localhost',
//   dialect: 'mysql'
// });

// const User = userModel(sequelize);

// sequelize.sync()
//   .then(() => {
//     console.log('Database and tables created.');
//   });

// module.exports = {
//   User
// };