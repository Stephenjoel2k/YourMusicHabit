const express = require('express')
const path = require('path');

const router = express.Router()

const { spotify } = require('../Models/spotifyApi.js')
const { getTopArtists, getTopTracks, getRecentlyPlayed } = require('../Models/user.js');


/**
 * Can be considered User "dashboard"
 * This is where the user will land once they login
 */
router.get('/', async (req, res) => {
  const access_token = await req.session.secret
  const user = await spotify.getUserProfile(access_token)
  const user_id = await user.id
  const name = await user.display_name
  req.session.name = name;
  req.session.user_id = user_id;
  res.render(path.resolve("./Views/User"), {"user_data": {name, user_id}});
})

/**
 * Get Top Artists of the user based on the term Specified
 */
router.get('/top-artists', async (req, res) => {
  const artists = await getTopArtists(req);
  res.send(artists);
})

/**
 * Get Top Tracks of the user based on the term Specified
 */
router.get('/top-tracks', async (req, res) => {
  const tracks = await getTopTracks(req);
  res.send(tracks)
})


/**
 * Logic: 1. We push all songs and prevent duplicate by keeping the played_at key unique 
 */
router.get('/recently-played', async (req, res) => {
    const access_token = await req.session.secret
    const user_id = await req.session.user_id
    const recent = await getRecentlyPlayed(access_token, user_id);
    res.send(recent);
})


module.exports = router
