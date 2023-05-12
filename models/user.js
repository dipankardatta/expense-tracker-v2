const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id:{
      type:Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: Sequelize.STRING,
    email: { type: Sequelize.STRING, 
              unique: true,
            allowNull: false, },
    password: Sequelize.STRING
  });

  return User;
};