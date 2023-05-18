const User = require('../models/user')
const Expense = require('../models/expense')
const Sequelize = require('../util/database')

const getUserLeaderBoard = async (req, res) => {
    try {
        const topUsers = await User.findAll({
            attributes:['name','totalExpenses'],
            // group:['user.id'],
            order:[['totalExpenses','DESC']],
            limit:10,
        });

        res.status(200).json(topUsers);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};


module.exports = {
    getUserLeaderBoard,
};
