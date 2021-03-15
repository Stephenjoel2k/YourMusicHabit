const express = require('express')
const mongodb = require('mongodb')
const moment = require('moment');
const router = express.Router()
const { spotify } = require('../Models/spotifyApi.js')
const { insert_recently_played } = require('../Models/user.js');


router.get('/', async (req, res) => {
  const access_token = await req.session.secret
  const user = await spotify.getUserProfile(access_token)
  const user_id = await user.id
  const name = await user.display_name
  req.session.name = name;
  req.session.user_id = user_id;
  res.render(path.resolve("./Views/User", {"user_data": {name, user_id}}));
 // return res.redirect('/user/' + req.session.user_id + '/recently-played')
})

router.get('/top-artists', async (req, res) => {
  const access_token = await req.session.secret
  const topArtists = await spotify.getUserTop("artists", "long_term", 50, 0, access_token)
  const artists = [];
  let i = 1;
  topArtists.items.forEach(artist => {
    artists.push(`${i++} : ${artist.name}`);
  })
  res.send(artists)
})

router.get('/top-tracks', async (req, res) => {
  const access_token = await req.session.secret
  const topTracks = await spotify.getUserTop("tracks", "long_term", 50, 0, access_token)
  const tracks = []
  let i = 1;
  topTracks.items.forEach(track => {
    tracks.push(`${i++} : ${track.name}`)
  })
  res.send(tracks)
})



/**
 * Logic: 1. We push all songs and prevent duplicate by keeping the played_at key unique 
 */
router.get('/recently-played', async (req, res) => {
    const access_token = await req.session.secret
    const user_id = await req.session.user_id
    const history = await spotify.recentlyPlayed(access_token)

    const tracks = [];

    //Loop through each item in the recently_played items array (currently reversed)
    history.items.forEach(item => {
        const artists = [];
        item.track.artists.forEach(artist => artists.push({ "artist_id": artist.id , "artist_name" : artist.name}));
        tracks.push({"played_at": new Date(moment(item.played_at).utc()), "artists": artists, "track_id" : item.track.id, "track_name": item.track.name, "popularity": item.track.popularity});
    })
    if(user_id != 'abc'){
      await insert_recently_played(user_id, tracks);
    }
    res.send(tracks);
})


const delay = (duration) =>
  new Promise(resolve => setTimeout(resolve, duration))

module.exports = router
