const { Model, DataTypes } = require('sequelize');

class User extends Model {}

module.exports = (sequelize) => {
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user'
  });

  return User;
};


// const Sequelize = require('sequelize');

// module.exports = (sequelize) => {
//   const User = sequelize.define('user', {
//     id: {
//       type: Sequelize.INTEGER,
//       autoIncrement: true,
//       allowNull: false,
//       primaryKey: true
//     },
//     name: Sequelize.STRING,
//     email: {
//       type: Sequelize.STRING,
//       unique: true,
//       allowNull: false,
//     },
//     password: Sequelize.STRING
//   });

//   return User;
// };