// backend/src/routes/payments.js
const Razorpay = require('razorpay');
const express = require('express');
const router = express.Router();

const rzp = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

router.post('/create-order', async (req,res)=>{
  const { amount, currency='INR', receipt } = req.body;
  const options = { amount: amount*100, currency, receipt: receipt || 'rcpt_' + Date.now() };
  try {
    const order = await rzp.orders.create(options);
    res.json(order);
  } catch(err){ res.status(500).json({error:err.message}); }
});
module.exports = router;
