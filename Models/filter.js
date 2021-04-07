/**
 * Contains functions that filter unecessary data to prevent space wastage.
 */
const moment = require('moment');

/**
 * Initially planned on using this function for storing into the DB
 * @param {array} items 
 * @returns 
 */
const recentTracks = (items) => {
    const recents = [];
    items.forEach(item => {
        const artists = [];
        item.track.artists.forEach(artist => {
            artists.push({"id": artist.id, "name" : artist.name});
        })
        const schema = {
            "track_id" : item.track.id,
            "track_name" : item.track.name,
            "artists": artists,
            "duration_ms" : item.track.duration_ms,
            "track_popularity" : item.track.popularity,
            "played_at" : item.played_at
        }
        recents.push(schema);
    });
    return recents;
}

/**
 * This is a better solution for storing in the DB as this is lighter and sufficient
 * @param {Array} items 
 * @returns 
 */
const dbRecentTracks = (items) => {
    const dbrecentIds = [];
    items.forEach(item => {
        dbrecentIds.push({"t_id": item.track.id,"played_at": new Date(moment(item.played_at).utc())});
    })
    return dbrecentIds;
}

const statsTracks = (items) => {
    const tracks = [];
    items.forEach(item => {
        const artists = [];
        item.artists.forEach(artist => {
            artists.push({"id": artist.id, 
                "name" : artist.name, 
                "followers": artist.followers.total,
                "genres": artist.genres,
                "popularity": artist.popularity
             });
        })
        const schema = {
            "played_at": item.played_at,
            "album" : {
                "album_type" : item.album.album_type,
                "id": item.album.id,
                "date":item.album.release_date,
                "name": item.album.name,
                "total_tracks": 8,
            },
            "artists": artists,
            "duration_ms" : item.duration_ms,
            "explicit": item.explicit,
            "name":item.name,
            "id":item.id,
            "popularity":item.popularity,
            "audio_features":{
                "danceability": item.audio_features.danceability,
                "energy": item.audio_features.energy,
                "key":item.audio_features.key,
                "loudness": item.audio_features.loudness,
                "mode": item.audio_features.mode,
                "speechiness": item.audio_features.speechiness,
                "acousticness": item.audio_features.acousticness,
                "instrumentalness": item.audio_features.instrumentalness,
                "liveness": item.audio_features.liveness,
                "valence": item.audio_features.valence,
                "tempo" : item.audio_features.tempo,
                "time_signature": item.audio_features.time_signature
            }
        }
        tracks.push(schema);
    });
    return tracks;
}



const filter = {
    recentTracks,
    dbRecentTracks,
    statsTracks
}

module.exports = {filter}