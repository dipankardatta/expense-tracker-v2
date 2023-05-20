const Expense = require('../models/expense');
const User = require('../models/user')
const sequelize = require('../util/database')
const AWS = require('aws-sdk')
const Userservices = require('../services/userservices')

function uploadToS3(data,filename){
    const BUCKET_NAME = 'expensetrackss';
    const IAM_USER_KEY = 'AKIASH3WOREHVTOHVWVW';
    const IAM_USER_SECRET='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';

    let s3bucket = new AWS.S3({
      accessKeyId : IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    })
       var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }
      return new Promise ((resolve,reject)=>{
        s3bucket.upload(params,(err,s3response)=>{
          if(err){
            console.log('Something went wrong',err)
            reject(err)
          }
          else{
            // console.log('success', s3response)
            resolve( s3response.Location)
          }
        })
      })
      
}

const downloadExpense = async (req,res) =>{
  try {
    const expenses = await Userservices.getExpenses(req)
    const stringifiedExpenses = JSON.stringify(expenses);
    const userId = req.user.id
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileURL = await uploadToS3( stringifiedExpenses,filename);
    res.status(200).json({fileURL,success: true})
  } catch(err){
    console.log(err)
    res.status(500).json({fileURL:"",success:false,err:null})
  }
    
    
}

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
  downloadExpense
};
