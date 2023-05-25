const Expense = require('../models/expense');
const User = require('../models/user')
const Downloadreport= require('../models/Downloadreport')
const sequelize = require('../util/database')
const Userservices = require('../services/userservices')
const S3services = require('../services/S3services')


    
const getExpenses = async (req, res) => {
  try {
    const check = req.user.ispremiumuser;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;
    
    const { count, rows: data } = await Expense.findAndCountAll({
      where: {
        userId: req.user.id,
      },
      offset: (page - 1) * pageSize,
      limit: pageSize,
      order: [['id', 'DESC']],
    });

    res.status(200).json({
      allExpense: data,
      check,
      currentPage: page,
      hasNextPage: pageSize * page < count,
      nextPage: page + 1,
      hasPreviousPage: page > 1,
      previousPage: page - 1,
      lastPage: Math.ceil(count / pageSize),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



  
  // Expense.findAll({where: {userId: req.user.id}}).then(expense =>{
  //     return res.status(200).json({ expense, success:true})
//   }).catch(err => {
//       console.log(err);
//       res.status(500).json({ error: err,success: false });
//   })
// };

const downloadExpense = async (req,res) =>{
  try {
    const expenses = await Userservices.getExpenses(req)
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense_${req.user.id}/${new Date()}.txt`;
    const fileURL = await S3services.uploadToS3( stringifiedExpenses,filename);
    await Downloadreport.create({fileURL:fileURL,userId:req.user.id})
    // const downloadreport = await req.user.createDownloadreport({URL:fileURL})
    res.status(200).json({fileURL,success: true})
  } catch(err){
    console.log(err)
    res.status(500).json({fileURL:"",success:false,error:err})
  }
    
    
}


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
  getExpenses,
  createExpense,
  deleteExpense,
  downloadExpense
};
