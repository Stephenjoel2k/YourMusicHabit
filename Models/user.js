const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const moment = require('moment');
const { spotify } = require('../Models/spotifyApi.js')

//Load all the tracks that are stored for the specific user
var get_all_tracks = async(user_id) => {
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

//Get all the user_ids of the app
var get_all_users = async() => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "RefreshTokens";
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const user_ids = [];
        (await db.listCollections().toArray()).forEach(collection => {
            user_ids.push(collection.name);
        })
        return user_ids;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}


//Load the recently played songs from the Mongodb
var get_recently_played = async(user_id, earliestSongInList) => {
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

//Insert recently played songs from the SPOTIFY API
var store_recently_played = async(user_id, tracks) => {
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
      await store_recently_played(user_id, tracks);
    }
    return tracks;
}

//stores the refresh_token of the current user
var store_refresh_token = async(body) => {
    const access_token = await body.access_token;
    const refresh_token = await body.refresh_token;
    const user = await spotify.getUserProfile(access_token);
    const user_id = user.id;

    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "RefreshTokens";
    const collectionName = user_id;
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const query = { "user_id": user_id };
        const update = { $set: { "user_id": user_id, "refresh_token": refresh_token }};
        const options = { upsert: true };
        await col.updateOne(query, update, options);
        return;
    } catch(err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
  }

//fetches the refresh_token of a specific user
var get_refresh_token = async(user_id) => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const dbName = "RefreshTokens";
    const collectionName = user_id;
    
    try{
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const refreshData = await col.findOne({"user_id": user_id});
        console.log(refreshData);
        return refreshData.refresh_token;
    } catch(err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}



module.exports = {   
                    get_recently_played,
                    store_recently_played,
                    get_all_tracks, 
                    get_all_users,
                    getTopArtists, 
                    getTopTracks, 
                    getRecentlyPlayed, 
                    store_refresh_token,
                    get_refresh_token
                }

