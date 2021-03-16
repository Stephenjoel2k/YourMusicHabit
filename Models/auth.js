const querystring = require('querystring');
let request = require('request')
require('dotenv').config()

//For the refresh tokens
const {spotify} = require('./spotifyApi')

//set refresh token
const {store_refresh_token, store_recently_played, getRecentlyPlayed} = require('./user');

  /**
   * 
   * @param {*} res 
   * @param {*} redirect_uri 
   */
  const getCode = (res, redirect_uri) => {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-recently-played user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing',
      redirect_uri
    }))
  }

  /**
   * 
   * @param {*} res 
   * @param {*} code 
   * @param {*} redirect_uri 
   */
  const getToken = (res, code, redirect_uri) => {
    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer.from(
            process.env.CLIENT_ID + ':' +  process.env.CLIENT_SECRET
        ).toString('base64'))
      },
      json: true
    }
    request.post(authOptions, async function(error, response, body) {
      var access_token = await body.access_token
      await store_refresh_token(body);
      let uri = process.env.MAIN_URI        //localhost or heroku
      res.redirect(uri + '?access_token=' + access_token)
    })
  }



  //
  /**
   * if unable to generate access token then we need to delete the user
   * Here we not only generate an access token but also make sure the user's recent is added to DB
   * @param {string} refresh_token 
   */
  var generate_access_token_and_store_recent = async(refresh_token) => {
    const refreshBody = querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    });
    const req = request(
      {
        // Assuming you have this setup as: https://accounts.spotify.com/api/token
        url: "https://accounts.spotify.com/api/token", 
        method: 'POST',
        headers:{
          // Authorization: Basic <base64 encoded client_id:client_secret>
          'Authorization':'Basic ' + (new Buffer.from(
            process.env.CLIENT_ID + ':' +  process.env.CLIENT_SECRET
        ).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(refreshBody)
        }
      },
      (err, res) => {
        if (res) {
          const resData = JSON.parse(res.body);
          // Set new access tokens
          access_token = resData.access_token;
          //get user
          //get recentlyPlayed
          //store the recentlyPlayed
          spotify.getUserProfile(access_token).then(user => {
            var user_id = user.id;
            getRecentlyPlayed(access_token, user_id).then(tracks => {
              store_recently_played(user_id, tracks).then(()=> {
                console.log("Successfully stored new tracks for " + user_id);
              })
            })
          });
        } else if (err) {
          //unable to generate an access token
          //delete user?
        }
      }
    );
    //Why? Can we remove this?
    req.write(refreshBody);
  }

  
module.exports = { getCode, getToken, generate_access_token_and_store_recent }
