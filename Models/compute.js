/**
 * Methods to compute relevant information from the fetched data
 */
var Heap = require('heap');
const moment = require('moment');


/**
 * 
 * @param {String} type // Days or Weeks
 * @param {Int} count  // Like 0 for today, 1 for yesterday or 0 for this week or 1 for last week
 * @param {Int} offset // Like 300 of EST/-5:00 or -330 for IST/+5:30 utc 
 * @returns {[Date, Date]} 
 */
const getDate = (type, count, offset) => {
    const start = new Date(moment(new Date()).utcOffset(-offset).subtract(count, type).startOf(type));
    const end = new Date(moment(new Date()).utcOffset(-offset).subtract(count, type).endOf(type));
    return [start, end];
}


/**
 * 
 * @param {Object} data     //tracks with all metadata
 * @returns {Int}  //Duration of Music listening in Minutes
 */
const findListenDuration = (data) => {
    if(!data || data.length == 0) return;
    var duration = 0;
    for(let i = 1; i < data.length; i++){
        var earlierSongEnd = moment(new Date(data[i-1].played_at))
        var earlierSongStart = moment(earlierSongEnd).subtract(data[i-1].duration_ms, 'milliseconds');
        var laterSongEnd =  moment(new Date(data[i].played_at))
        var laterSongStart = moment(laterSongEnd).subtract(data[i].duration_ms, 'milliseconds');
        const songEnd = moment(laterSongStart).isBefore(earlierSongEnd) ? laterSongStart : earlierSongEnd;
        duration += moment.duration(Math.abs((earlierSongStart.diff(songEnd))));
    }
    //returns duration in minutes
    return (duration/(1000*60));
} 

/**
 * 
 * @param {Object} data     //tracks with all metadata
 * @returns The start and end timestamps of sessions
 */
const findListenSessions = (data) => {
    if(!data || data.length == 0) return;

    const sessions = [];
    var session_start = null
    var session_end = null
    for(let i = 0; i < data.length-1; i++){

        var earlierSongEnd = moment(new Date(data[i].played_at))
        var earlierSongStart = moment(earlierSongEnd).subtract(data[i].duration_ms, 'milliseconds');
        var laterSongEnd =  moment(new Date(data[i+1].played_at))
        var laterSongStart = moment(laterSongEnd).subtract(data[i+1].duration_ms, 'milliseconds');
        if(session_start == null) 
            session_start = earlierSongStart;
        session_end = earlierSongEnd;
        const difference = moment.duration(Math.abs((earlierSongEnd.diff(laterSongStart))));
        
        //If the gap between the 2 songs is greater than 15 mins then end the session
        if(difference.asMinutes() > 15){
            const session_duration = moment.duration(Math.abs((session_start.diff(session_end))));
            if(session_duration.asMinutes() > 30) { //if duration of the session is greater than 15 mins then add it
                sessions.push({session_start, session_end});
            } 
            session_start = null;
            session_end = null;
        }else{
            session_end = laterSongEnd;
        }

    }
    if(session_start && session_end){
        const session_duration = moment.duration(Math.abs((session_start.diff(session_end))));
        if(session_duration.asMinutes() > 30) { //if duration of the session is greater than 15 mins then add it
            sessions.push({session_start, session_end});
        } 
    } 
    return sessions;
}



/**
 * 
 * @param {Object} data //tracks with all metadata
 * @param {Int} N 
 * @returns Top N Artists in array format
 */
const findTopNArtists = (data, N) => {
    if(!data || data.length == 0) return;
    const artistsMap = {};
    for(let i = 0; i < data.length; i++){
        const artists = data[i].artists;
        artists.forEach(artist => {
            const id = artist.id;
            if(artistsMap[id]){
                artistsMap[id].listens += 1;
            }else{
                artistsMap[id] = {
                    artist,
                    "listens": 1
                }
            }
        })
    }
    var heap = new Heap(function(a, b) {
        return b.listens - a.listens;
    });
    const artistsIds = Object.keys(artistsMap); 
    artistsIds.forEach(id => {
        heap.push(artistsMap[id]);
    })
    const artists = [];
    while(heap.size() > 0 && N-- > 0){
        artists.push(heap.pop());
    }
    return artists;
}


/**
 * 
 * @param {Object} data //tracks with all metadata
 * @param {Int} N 
 * @returns Top N Tracks in an Array format
 */
const findTopNTracks = (data, N) => {
    if(!data || data.length == 0) return;
    const tracksMap = {};
    for(let i = 0; i < data.length; i++){
        var id = data[i].id;
        if(tracksMap[id]){
            tracksMap[id].listens += 1;
            tracksMap[id].played_at.push(data[i].played_at)
        }else{
            tracksMap[id] = {
                "track": data[i],
                "listens": 1,
                "played_at": [data[i].played_at]
            }
        }
    }
    var heap = new Heap(function(a, b) {
        return b.listens - a.listens;
    });
    const tracksIds = Object.keys(tracksMap); 
    tracksIds.forEach(id => {
        heap.push(tracksMap[id]);
    })
    
    const tracks = [];
    while(heap.size() > 0 && N-- > 0){
        tracks.push(heap.pop());
    }
    return tracks;

}


const compute = {
    getDate,
    findListenDuration,
    findListenSessions,
    findTopNArtists,
    findTopNTracks
}

module.exports = { compute };