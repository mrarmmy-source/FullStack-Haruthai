const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in .env');
}

// Client สำหรับ user ทั่วไป (ใช้ RLS)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client สำหรับ admin (bypass RLS) — ใช้เฉพาะใน server-side ที่ต้องการสิทธิ์สูง
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

module.exports = { supabase, supabaseAdmin };
