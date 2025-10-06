const { createClient } = require( '@supabase/supabase-js');
require('dotenv').config();

const supabaseDB = createClient(
    process.env.SUPABASE_URL_DB,
    process.env.SUPABASE_KEY_DB
);

module.exports = supabaseDB;