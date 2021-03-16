# YourMusicHabit

link: https://yourmusichabit.herokuapp.com/

Keeps track of your music history from the moment you register and provide you with interesting insights.

## Current Status

1. Calls the SpotifyAPI and successfully authenticates a user. 
2. Fetches and updates the user's recently played catalogue when user logins in.
3. User can view their top artists/tracks
4. A drop down menu to choose the top artists/tracks/recent dynamically. (long_term/short_term)
5. A cron job that updates the db every 2 hours -> (yet to be developed on production env)

## Upcoming 

1. Make the top artists/tracks more visually appealing
2. Create a prettier dashboard
3. Add Data Visualization/Charts on Demand.
4. Add the feature to create groups.
5. A specific song over time graph. So that a user can see the number of times the user listened to the song/genre overtime.

## Feature Ideas

1. How mainstream are you? Analyses user's past 50 songs and favorite artists/tracks based on different terms - to provide them information on their genre/mainstreamness. This will get an hollistic view of how popular the artists they listen to are! And look at the trend of their top artists every term.


## Sprints

1. 5:30:00hrs - Setup backend
2. 4:30:00hrs - Creating visual charts on Mongo/building the UI
3. 1:00:00hr - Deployed to Heroku
4. 2:00:00hr - Fixed Favicon and dropdown menu
5. 4:00:00hr - Getting Refresh Tokens and Cron job in local server

Total: 17hrs