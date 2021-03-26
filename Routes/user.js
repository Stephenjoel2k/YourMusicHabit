const express = require('express')
const router = express.Router()
const { spotify } = require('../Models/spotify.js')

/**
 * Fetches user profile
 */
router.get('/', async (req, res) => {
  try{
    const access_token = req.token;
    const user = await spotify.getUserProfile(access_token)
    return res.status(200).json({
      success: true,
      message: "Data successfully Fetched",
      data: user
    });
  }catch(err){
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
})

/**
 * Get Top Artists of the user based on the term Specified
 */
router.get('/top-artists', async (req, res) => {
  try{
    const access_token = req.token;
    const term = req.query.term;
    const artists = await spotify.getUserTopArtists(access_token, term);
    return res.status(200).json({
      success: true,
      message: "Data successfully Fetched",
      data: artists
    });
  }catch(err){
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
})

/**
 * Get Top Tracks of the user based on the term Specified
 */
router.get('/top-tracks', async (req, res) => {
  try{
    const access_token = req.token;
    const term = req.query.term;
    const tracks = await spotify.getUserTopTracks(access_token, term);
    return res.status(200).json({
      success: true,
      message: "Data successfully Fetched",
      data: tracks
    });
  }catch(err){
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
  })


/**
 * Logic: 1. We push all songs and prevent duplicate by keeping the played_at key unique 
 */
router.get('/recently-played', async (req, res) => {
  try{
    const access_token = req.token;
    const recent = await spotify.getUserRecentlyPlayed(access_token);
    return res.status(200).json({
      success: true,
      message: "Data successfully Fetched",
      data: recent
    });
  }catch(err){
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
})




module.exports = router
