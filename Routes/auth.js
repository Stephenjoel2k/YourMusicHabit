const express =  require('express')
const querystring = require('querystring');
const request = require('request');
const router =  express.Router()

// The login redirection for the callback (Spotify Oauth) (add process.env.REDIRECT_URI to heroku when hosted)
const redirect_uri = process.env.REDIRECT_URI

/**
 * When pressed the login button or
 * When the user wants to view the main features of the application
*/
router.get('/login', function(req, res) {
    res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: 'user-read-private user-read-email user-read-recently-played user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing',
      redirect_uri
    }))
})


/**
 * When pressed the login button or
 * When the user wants to view the main features of the application
*/

router.get('/callback', function(req, res) {
    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: req.query.code || null,
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
      request.post(authOptions, async(error, response, body) => {
        var access_token = await body.access_token
        //store the value in DynamoDB
        var refresh_token = await body.refresh_token
        let uri = process.env.MAIN_URI        //localhost or heroku
        res.redirect(uri + '?access_token=' + access_token)
      })
})



module.exports = router
