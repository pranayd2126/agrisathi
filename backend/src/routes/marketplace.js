const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Listing = require('../models/Listing');
const router = express.Router();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create', upload.single('image'), async (req,res)=>{
  try {
    let imageUrl = '';
    if(req.file){
      // upload buffer to cloudinary
      const uploadResult = await cloudinary.uploader.upload_stream({ folder:'agrisathi' }, (err,result)=>{
        if(err) throw err;
        imageUrl = result.secure_url;
      });
      // middleware using buffer requires extra handling — simplified: you can send base64 from frontend, easier.
    }
    const listing = new Listing({ sellerId: req.body.sellerId, crop:req.body.crop, price:req.body.price, qty:req.body.qty, image:imageUrl });
    await listing.save();
    res.json(listing);
  } catch(err){ console.error(err); res.status(500).json({error:err.message}); }
});

router.get('/list', async (req,res)=>{
  const items = await Listing.find().limit(200);
  res.json(items);
});

module.exports = router;
