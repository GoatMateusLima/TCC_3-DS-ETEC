const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/../../.env' });

const SUPABASE_URL_DB = process.env.SUPABASE_URL_DB;
const SUPABASE_KEY_DB = process.env.SUPABASE_KEY_DB;

if (!SUPABASE_URL_DB || !SUPABASE_KEY_DB) {
    console.error('Missing SUPABASE_URL_DB or SUPABASE_KEY_DB environment variables.');
    throw new Error('Supabase DB configuration is missing. Set SUPABASE_URL_DB and SUPABASE_KEY_DB.');
}

const supabaseDB = createClient(SUPABASE_URL_DB, SUPABASE_KEY_DB);

module.exports = supabaseDB;