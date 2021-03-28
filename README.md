# YourMusicHabit

link: https://yourmusichabit.herokuapp.com/api/

Api for the app that keeps track of your music history from the moment you register and provide you with interesting insights.

## Current Status

1. Calls the SpotifyAPI and successfully authenticates a user. 
2. Fetches and updates the user's recently played catalogue when user logins in.
3. User can view their top artists/tracks
4. A drop down menu to choose the top artists/tracks/recent dynamically. (long_term/short_term)
5. A cron job that updates the db every 2 hours


## Feature Ideas

1. How mainstream are you? Analyses user's past 50 songs and favorite artists/tracks based on different terms - to provide them information on their genre/mainstreamness. This will get an hollistic view of how popular the artists they listen to are! And look at the trend of their top artists every term.
2. Scan QR Code/or through invite link, match the mutual artists/tracks in different timespans and also provide an analysis on similarities. Potentially create a playlist based on 2 tastes.
3. Send weekly detailed statistics about user's music habits! And use third party API to analyse user's music taste/habits.
4. Automatically create spotify playlists based on 4 people's music taste

## POTENTIAL HAZARDS

1. API RATE OVERLOADING
2. No unit tests implemented

## ISSUES

https://github.com/Stephenjoel2k/MusicHabits-API/issues
