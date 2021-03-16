const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const moment = require('moment');
const { spotify } = require('../Models/spotifyApi.js')

var load_all_tracks = async(user_id) => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = user_id;
    const collectionName = "recently-played";
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const tracks = [];
        await col.find({}).forEach(track => tracks.push(track));
        return tracks;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

var load_recently_played = async(user_id, earliestSongInList) => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = user_id;
    const collectionName = "recently-played";
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const times = [];
        await col.find({ "played_at" : { $gt : new Date(earliestSongInList)} }).forEach(time => {times.push(time.played_at)});
        return times;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

var insert_recently_played = async(user_id, tracks) => {
    if(tracks.length < 1){
        return;
    } 
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = user_id;
    const collectionName = "recently-played";
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        //using the played_at as the unique key
        await col.createIndex( { "played_at": 1 }, { unique: true } )
        for(let i = 0; i < tracks.length; i++){
            await col.insertOne(tracks[i]);
        }
        return;
    } catch (err) {
        
        if( err && err.code === 11000 ) {
            return;
        }
        else{
            console.log(err.stack);
        }

    } finally {
        await client.close();
    }
}

var getTopArtists = async(req) => {
    const access_token = await req.session.secret
    const term = await req.query.term
    const topArtists = await spotify.getUserTop("artists", term, 50, 0, access_token)
    const artists = [];
    let i = 1;
    topArtists.items.forEach(artist => {
      artists.push(`${i++} : ${artist.name}`);
    })
    return artists;
}

var getTopTracks = async(req) => {
    const access_token = await req.session.secret
    const term = await req.query.term
    const topTracks = await spotify.getUserTop("tracks", term, 50, 0, access_token)
    const tracks = []
    let i = 1;
    topTracks.items.forEach(track => {
        tracks.push(`${i++} : ${track.name}`)
    })
    return tracks;
}

var getRecentlyPlayed = async(req) => {
    const access_token = await req.session.secret
    const user_id = await req.session.user_id

    //get recently played songs
    const history = await spotify.recentlyPlayed(access_token)

    const tracks = [];

    //Loop through each item in the recently_played items array (currently reversed)
    history.items.forEach(item => {
        const artists = [];
        item.track.artists.forEach(artist => artists.push({ "artist_id": artist.id , "artist_name" : artist.name}));
        tracks.push({"played_at": new Date(moment(item.played_at).utc()), "artists": artists, "track_id" : item.track.id, "track_name": item.track.name, "popularity": item.track.popularity});
    })

    //insert to database while fetching if new songs are found
    if(user_id != 'abc'){
      await insert_recently_played(user_id, tracks);
    }
    return tracks;
}

module.exports = { load_recently_played, insert_recently_played, load_all_tracks, getTopArtists, getTopTracks, getRecentlyPlayed }

