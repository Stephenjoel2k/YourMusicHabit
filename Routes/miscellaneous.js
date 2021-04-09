/**
 * This route doesn't interact with the database.
 * This only computes basic data that frontend cannot compute.
 */

 const express = require('express')
 const router = express.Router()
 const { extractColors } = require('extract-colors')


/**
 * Get top colors features of an image
 */
 router.get('/colors', async (req, res) => {
    try{
      const img1 = req.query.image1;
      const img2 = req.query.image2;
      const image1 = await extractColors(img1);
      const image2 = await extractColors(img2);
      return res.status(200).json({
        success: true,
        message: "Colors successfully computed",
        data: {
            image1, image2
        }
      });
    }catch(err){
      console.log(err.stack);
      return res.status(401).json({
        success: false,
        message: "Failed to compute color",
        data: null
      });
    }
  })

  module.exports = router