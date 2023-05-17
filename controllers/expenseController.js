const Expense = require('../models/expense');
const User = require('../models/user')
const sequelize = require('../util/database')


const getExpenses = async (req, res) => {
  
    Expense.findAll({where: {userId: req.user.id}}).then(expense =>{
        return res.status(200).json({ expense, success:true})
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err,success: false });
    })
};

const createExpense = async (req, res) => {
  const t = await sequelize.transaction()
  const { name, amount } = req.body;

  if (amount == undefined || amount.length === 0){
    return res.status(400).json({success:false, message:'Paramters Missing'})
  }
  Expense.create({ name, amount, userId: req.user.id }).then(expense =>{
    const totalExpense = Number(req.user.totalExp) + Number(amount)
    console.log(totalExp)
    User.update({
      totalExp: totalExpense
    },{
      where: {id: req.user.id},
      transaction :t
    }).then(async() => {
      await t.commit()
      return res.status(200).json({expense: expense})
    })
    .catch(async(err) =>{
      await t.rollback()
      return res.status(500).json({success: false,error:err})
    })
  }).catch(async(err) =>{
    await t.rollback()
    return res.status(500).json({success: false,error:err})
  })

};

const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const t = await sequelize.transaction();

    await Expense.destroy({ where: { id, userId: req.user.id }, transaction: t });

    await t.commit();

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    await t.rollback();
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
