const moment = require('moment');

// Mongo Imports
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;

//For getting user_id;
const {spotify} = require('./spotify');

/**
 * Insert all the recently played songs received from the function "getRecentlyPlayed()" to the mongo
 * @param {String} access_token 
 * @param {Array} tracks 
 * @returns null
 */
const putTracks = async(access_token, tracks) => {
    if(tracks < 1) return;

    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try{

        const user = await spotify.getUserProfile(access_token);
        const user_id = user.id;

        const dbName = "Tracks";
        const collectionName = user_id;

        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        //To prevent duplicates while inserting in 1 insert
        await col.createIndex( { "played_at": 1 }, { unique: true } )
        await col.insertMany(tracks,{ordered: false})
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

/**
 * 
 * @param {String} access_token 
 * @param {Date} from 
 * 
 * Currently timezone agnostic
 */
const getTracks = async(access_token, start, end) => {

    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try{
        const user = await spotify.getUserProfile(access_token);
        const user_id = user.id;

        const dbName = "Tracks";
        const collectionName = user_id;

        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const tracks = [];
        await col.find({"played_at": {$gte: start, $lte: end}}).forEach(track => tracks.push(track));
        return tracks;
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
}

/**
 * 
 * @param {String} access_token 
 * @param {String} refresh_token 
 * @param {Boolean} permission 
 * @returns 
 */
const putRefreshToken = async(access_token, refresh_token, permission) => {
    
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try{
        const user = await spotify.getUserProfile(access_token);
        const user_id = user.id;
        
        const dbName = "InternalData";
        const collectionName = "RefreshTokens";

        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const query = { "user_id": user_id };
        const update = { $set: { "user_id": user_id, "refresh_token": refresh_token, "track_history": permission}};
        const options = { upsert: true };
        await col.updateOne(query, update, options);
        return;
    } catch(err) {
        //handle error
        console.log(err.stack);
    } finally {
        await client.close();
    }
  }

/**
 * Get all user's refresh token if their track_history permission is set to true
 */
const getAllUserTokens = async() => {

    const url = process.env.MONGO_URI;
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try{
        const dbName = "InternalData";
        const collectionName = "RefreshTokens";

        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const user_tokens = [];
        await col.find({track_history: true}).forEach(user_token => user_tokens.push(user_token))
        return user_tokens;
    }catch(err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }

}




const db = {
    putTracks,
    getTracks,
    putRefreshToken,
    getAllUserTokens
}

module.exports = {db};