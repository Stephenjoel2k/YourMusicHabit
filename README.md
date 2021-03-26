# YourMusicHabit

link: https://yourmusichabit.herokuapp.com/api/

Api for the app that keeps track of your music history from the moment you register and provide you with interesting insights.

## Current Status

1. Calls the SpotifyAPI and successfully authenticates a user. 
2. Fetches and updates the user's recently played catalogue when user logins in.
3. User can view their top artists/tracks
4. A drop down menu to choose the top artists/tracks/recent dynamically. (long_term/short_term)
5. A cron job that updates the db every 2 hours -> (yet to be developed on production env)


# Important DB structural change

1. Have a tracks collection with all unique track's metadeta in it. 
2. Whenever a user listens to a song, store only the track_id and played_at.
3. Or something along its lines to decrease the space consumption.


## Upcoming 

1. Make the top artists/tracks more visually appealing
~2. Create a prettier dashboard~
3. Add Data Visualization/Charts on Demand.
4. Add the feature to create groups.
5. A specific song over time graph. So that a user can see the number of times the user listened to the song/genre overtime.
6. Your top artists with features like "new entry" and arrows to show the change in rankings of your artists like marbula's.

## Feature Ideas

1. How mainstream are you? Analyses user's past 50 songs and favorite artists/tracks based on different terms - to provide them information on their genre/mainstreamness. This will get an hollistic view of how popular the artists they listen to are! And look at the trend of their top artists every term.
2. Scan QR Code/or through invite link, match the mutual artists/tracks in different timespans and also provide an analysis on similarities. Potentially create a playlist based on 2 tastes.
3. Send weekly detailed statistics about user's music habits! And use third party API to analyse user's music taste/habits.

## POTENTIAL HAZARDS

1. API RATE OVERLOADING -> Haven't handled errors reagarding API rate limiting.
2. No unit tests implemented

## Issues

1. Fix the updateTracks middleware to make the code more efficient.
2. Restructure the mongo schema to decrease the number of calls required.
3. Mongodb restricts the number of database, so restructure the code to make sure users share DB.
