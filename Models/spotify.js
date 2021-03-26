const axios = require('axios');

/**
 * 
 * @param {string} access_token 
 * @returns The basic profile of the current user
 */
const getUserProfile = async (access_token) => {
  const url = "https://api.spotify.com/v1/me"
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return response.data
}

/**
 * @param {string}  access_token 
 * @param {string} time_range "long_term" or "medium_term" or "short_term"
 * @returns //Top artists for the given time range
 */
const getUserTopArtists = async(access_token, time_range) => {
  const url = "https://api.spotify.com/v1/me/top/artists?time_range=" + time_range + "&limit=50";
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return response.data;
}

/**
 * @param {string}  access_token 
 * @param {string} time_range "long_term" or "medium_term" or "short_term"
 * @returns //Top tracks for the given time range
 */
const getUserTopTracks = async(access_token, time_range) => {
  const url = "https://api.spotify.com/v1/me/top/tracks?time_range=" + time_range + "&limit=50";
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return response.data;
}

/**
 * 
 * @param {token} access_token 
 * @returns 50 recently played tracks in json
 */
 const getUserRecentlyPlayed = async(access_token) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50"
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return response.data
}


/**
 * 
 * @param {string} access_token 
 * @returns the number of seconds remaining in the current track in seconds
 */
const getUserCurrentlyPlaying = async(access_token) => {
  var time_remaining
  const url = "https://api.spotify.com/v1/me/player/currently-playing"
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  var json = response.data
  var progress = parseInt(json.progress_ms)
  var duration =  parseInt(json.item.duration_ms)
  time_remaining = duration - progress
  return time_remaining
}





const spotify = {
  getUserProfile,
  getUserTopArtists,
  getUserTopTracks,
  getUserRecentlyPlayed,
  getUserCurrentlyPlaying
}

module.exports = { spotify }
