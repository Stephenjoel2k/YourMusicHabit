const cron = require('node-cron');
const {generate_access_token_and_store_recent} = require('../Models/auth');
const {get_all_users, get_refresh_token} = require('../Models/user');


// Schedule tasks to be run on the server.
cron.schedule('*/10 * * * * *', async() => {
    const user_ids = await get_all_users();
    console.log(user_ids);
    for(let i = 0; i<user_ids.length; i++){
        const refresh_token = await get_refresh_token(user_ids[i]);
        await generate_access_token_and_store_recent(refresh_token);
    }
});
