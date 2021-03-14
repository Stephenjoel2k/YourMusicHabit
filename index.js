const express = require('express')
const session = require("express-session")
const app = express()
const auth = require('./Routes/auth.js')


//Middleware
app.use(express.json())
app.use(session({
  name: 'abc',
  secret: 'abc',
  user_id: 'abc',
  saveUninitialized: true,
  resave: true,
    cookie: {
      secure: false,
      maxAge: 2160000000,
      httpOnly: false
  }
}))


//Routes
app.use('/auth', auth)

app.get('/', async (req, res) => {
  const access_token = await req.query.access_token
  if(access_token == null){
    res.redirect("/auth/login")
  }
  else{
    req.session.name = "username"
    req.session.secret = access_token
    res.send(req.session.secret);
  }
})

//Hosting PORT
const port = 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}.`)
})
