const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();

// a cron task
const {updateUsersTracks} = require('./Middleware/updateTracks');

// Check if the token is provided
const {checkToken} = require('./Middleware/token');

//Import Routes
const authRoutes = require('./Routes/auth')
const userRoutes = require('./Routes/user')


//Middleware
app.use(express.json())
app.use(cors());
app.use('/api/database/update', updateUsersTracks)
app.use('/auth', authRoutes);
app.use(checkToken);
app.use('/api/user', userRoutes);

//Hosting PORT
const port = process.env.PORT;  //3000 for local
app.listen(port);
