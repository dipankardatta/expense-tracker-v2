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
    const totalExpense = Number(req.user.totalExpenses) + Number(amount)
    console.log(totalExpense)
    User.update({
      totalExpenses: totalExpense
    },{
      where: {id: req.user.id},
      // transaction :t
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
    const delexp = req.params.id;
    const t = await sequelize.transaction();
    const user = await User.findByPk(req.user.id);

    if (delexp == undefined || delexp.length == 0) {
      return res.status(400).json({ success: false });
    }

    try {
      const expense = await Expense.findOne({
        where: { id: delexp, userId: req.user.id },
        transaction: t,
      });

      if (!expense) {
        return res.status(404).json({ success: false, message: 'Expense Not found' });
      }

      await Expense.destroy({
        where: { id: delexp, userId: req.user.id },
        transaction: t,
      });

      user.totalExpenses -= expense.amount;
      await user.save({ transaction: t });

      await t.commit();
      return res.sendStatus(204);
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(500).json({ success: false, message: 'Failed', user: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  deleteExpense,
};




module.exports = {
  getExpenses,
  createExpense,
  deleteExpense,
};
