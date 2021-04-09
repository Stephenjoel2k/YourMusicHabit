/**
 * This route doesn't interact with the database.
 * This only calls the spotify API to get basic user info like profile, topArtists, topTracks and recentlyPlayed.
 */

const express = require('express')
const router = express.Router()
const { spotify } = require('../Models/spotify')
const { getStats } = require('../Models/stats')

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
    console.log(err.stack);
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
    console.log(err.stack);
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
    console.log(err.stack);
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
  })


/**
 * Get the 50 recently played songs of the user
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
    console.log(err.stack);
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
})


/**
 * Get top Artists/Tracks with all metadata(audio_features, played_ats etc)
 */
router.get('/stats', async (req, res) => {
  try{
    const access_token = req.token;
    const type = req.query.type;
    const count = req.query.count;
    const offset = req.query.offset;
    const stats = await getStats(access_token, type, count, offset);
    return res.status(200).json({
      success: true,
      message: "Data successfully Fetched",
      data: stats
    });
  }catch(err){
    console.log(err.stack);
    return res.status(401).json({
      success: false,
      message: "Failed to fetch data",
      data: null
    });
  }
})




module.exports = router
