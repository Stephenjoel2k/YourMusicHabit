//Extracts filters and returns all relevant data from the user's saved DB ids.
const {db} = require('./db');
const {spotify} = require('./spotify');
const {filter} = require('./filter');
const {compute} = require('./compute');

/**
 * 
 * @param {*} access_token 
 * @param {String} type // Days or Weeks
 * @param {Int} count  // Like 0 for today, 1 for yesterday or 0 for this week or 1 for last week
 * @param {Int} offset // Like 300 of EST/-5:00 or -330 for IST/+5:30 utc 
 */
const getStats = async (access_token, type, count, offset) => {
    var [start, end] = compute.getDate(type, count, offset);
    const tracksDB = await db.getTracks(access_token, start, end);        //Get tracks within the defined start, end date from DB
    const tracksData = await TrackIDtoTrackData(access_token, tracksDB);  //Add all data in tracks and filter out irrelevant key/value pairs

    // Can add more functions here to get more descriptive stats
    const topArtists = compute.findTopNArtists(tracksData, 50); 
    const topTracks = compute.findTopNTracks(tracksData, 50);
    const sessions = compute.findListenSessions(tracksData);
    const duration = compute.findListenDuration(tracksData);    
    return {topArtists, topTracks, sessions, duration, tracksData};
}








/***********************************************************************************************************************************
 * Functions below help filtering and adding data to tracks using SPOTIFY API
 */


/**
 * 
 * @param {*} tracks 
 * @returns 
 */
const TrackIDtoTrackData = async (access_token, tracks) => {
    if(!tracks || tracks.length == 0) return;

    const tracksWithFullData = [];
    //Chunking tracks by 50 each time
    for (var i=0,j = tracks.length; i<j; i+=50) {
        const tracks50 = tracks.slice(i, i+50);
        const trackIds = [];
        tracks50.forEach(track => { trackIds.push(track.t_id)});
        const tracks50WithTrackdata = await spotify.getSeveralTracks(access_token, trackIds);
        const tracks50WithAudioFeatures = await spotify.getSeveralTracksAudioFeatures(access_token, trackIds);
        const tracks50WithFullData = merge(tracks50WithTrackdata, tracks50WithAudioFeatures);
        tracks50WithFullData.forEach(track => tracksWithFullData.push(track));
    }
    var tracksAndArtistsWithFullData = await addArtistInfo(access_token, tracksWithFullData);  //Add artist info
    insertPlayedAt(tracks, tracksAndArtistsWithFullData)  //Add played_at timestamps to the data
    const filteredData = filter.statsTracks(tracksAndArtistsWithFullData);     // remove unecessary key value pairs from the object
    return filteredData;  //return data;
}


/**
 * Merge audio features and track data
 * @param {*} tracks 
 * @param {*} audio_features 
 * @returns 
 */
const merge = (tracks, audio_features) => {
    if(tracks.length != audio_features.length) return;
    var length = tracks.length;
    const mergedData = [];
    for(var i = 0; i < length; i++){
        var trackDataObject = tracks[i];
        trackDataObject.audio_features = audio_features[i];
        mergedData.push(trackDataObject);
    }
    return mergedData;
}

/**
 * 
 * @param {*} access_token 
 * @param {*} data 
 * @returns 
 */
const addArtistInfo = async (access_token, data) => {
    if(!data || data.length == 0) return;

    const tracks = data;
    let artists_ids = [], merge_info_ids = [];
    let start_pos = 0;
    for(let i = 0; i < tracks.length; i++){
        const no_of_ids = tracks[i].artists.length;
        const ids = tracks[i].artists.map(artist => artist.id);
        if(no_of_ids + artists_ids.length <= 50){
            ids.forEach(id => {artists_ids.push(id)});
            merge_info_ids.push(no_of_ids);
        }else{
            await fetchAndMergeArtists(artists_ids, merge_info_ids, start_pos, access_token, data);
            artists_ids = [];
            start_pos = merge_info_ids.length;
            ids.forEach(id => {artists_ids.push(id)});
            merge_info_ids.push(no_of_ids);
        }
    }
    await fetchAndMergeArtists(artists_ids, merge_info_ids, start_pos, access_token, data);
    return data;
}


/**
 * Merges artists info with track & audio features
 * @param {*} artists_ids 
 * @param {*} merge_info_ids 
 * @param {*} start_pos 
 * @param {*} access_token 
 * @param {*} data 
 * @returns 
 */
const fetchAndMergeArtists = async (artists_ids, merge_info_ids, start_pos, access_token, data) => {
    if(!data || data.length == 0) return;
    const artists_data = await spotify.getSeveralArtists(access_token, artists_ids);
    for(let i = start_pos, j = 0; i < merge_info_ids.length; i++){
        var count = merge_info_ids[i];
        data[i].artists = artists_data.slice(j, j+count);
        j += count;
    }
    return;
}

/**
 * 
 * @param {Object} PlayedAt 
 * @param {Object} trackWithFullData 
 */
 const insertPlayedAt = (PlayedAt, trackWithFullData) => {
    for(let i = 0; i < trackWithFullData.length; i++){
        trackWithFullData[i].played_at = PlayedAt[i].played_at;
    }
}




module.exports = { getStats };