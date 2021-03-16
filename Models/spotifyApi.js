const axios = require('axios');
var request = require('request');

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
 * 
 * @param {string} type "artists" or "tracks" 
 * @param {string} time_range "long_term" or "medium_term" or "short_term"
 * @param {int} limit 0-50 
 * @param {int} offset 0-50
 * @param {string}  access_token 
 * @returns //Top artists or tracks in json depending on the time_range, limit and offset.
 */
const getUserTop = async(type, time_range, limit, offset, access_token) => {
  const url = "https://api.spotify.com/v1/me/top/" + type + "?time_range=" + time_range + "&limit=" + limit + "&offset=" + offset
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
 * @returns device_ids of active devices
 */
const getUserDevices = async(access_token) => {
  const active_devices = []
  const url = "https://api.spotify.com/v1/me/player/devices"
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  const devices = response.data.devices
  devices.forEach(device => {
    if(device.is_active){
      active_devices.push(device.id)
    }
  });
  return active_devices
}

/**
 * 
 * @param {string} access_token 
 * @param {string} device_id 
 * @param {string} track_id 
 */
const addToQueue = async(access_token, device_id, track_id) => {
  const url = "https://api.spotify.com/v1/me/player/add-to-queue?uri="+ track_id  + "&device_id=" + device_id
  request.post(url,{ headers: { Authorization: "Bearer " + access_token } },
      function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body);
          }
      }
  );
}

/**
 * 
 * @param {string} access_token 
 * @returns the number of seconds remaining in the current track in seconds
 */
const currentlyPlaying = async(access_token) => {
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


/**
 * 
 * @param {token} access_token 
 * @returns 50 recently played tracks in json
 */
const recentlyPlayed = async(access_token) => {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=50"
  const response = await axios.get(url, {
    headers: {
      Authorization: "Bearer " + access_token
    }
  });
  return response.data
}

/**
 * Allowing the access of all these spotifyAPI based functions using a single "classname"
 */
const spotify = {
  currentlyPlaying,
  getUserProfile,
  getUserTop,
  getUserDevices,
  currentlyPlaying,
  addToQueue,
  recentlyPlayed
}

module.exports = { spotify }
