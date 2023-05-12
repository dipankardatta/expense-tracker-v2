const Sequelize = require('sequelize');
const userModel = require('../models/user');

const sequelize = new Sequelize('user', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql'
});

const User = userModel(sequelize);

sequelize.sync()
  .then(() => {
    console.log('Database and tables created.');
  });

module.exports = {
  User
};