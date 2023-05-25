const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Downloadreport = sequelize.define('downloadreport',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull: false,
        primaryKey:true
    },
    URL:Sequelize.STRING
})
module.exports = Downloadreport