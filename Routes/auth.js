const express =  require('express')
const router =  express.Router()
const { getCode, getToken } = require('../Models/auth.js')

// The login redirection for the callback (Spotify Oauth) (add process.env.REDIRECT_URI to heroku when hosted)
const redirect_uri = 'http://localhost:3000/auth/callback/'

/**
 * When pressed the login button or
 * When the user wants to view the main features of the application
*/
router.get('/login', function(req, res) {
    getCode(res, redirect_uri)
})


/**
 * When logining in, this is automatically called
 * by the function to receive the token from Spotify.
*/
router.get('/callback', function(req, res) {
  const code = req.query.code || null
  const user_token = getToken(res, code, redirect_uri)
})


module.exports = router
