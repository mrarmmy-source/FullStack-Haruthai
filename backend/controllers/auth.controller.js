const { supabaseAdmin } = require('../config/supabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'haruthai-secret-key';

async function register(req, res, next) {
  try {
    const { fullname, phone, pin, email } = req.body;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert([{
        id: crypto.randomUUID(),
        full_name: fullname,
        phone_number: phone,
        pin_code: pin,
        email: email || null
      }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ user: data });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { phone, pin } = req.body;
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('phone_number', phone)
      .eq('pin_code', pin)
      .single();
    if (error || !data) return res.status(401).json({ error: 'Invalid phone or PIN' });
    const token = jwt.sign(
      { id: data.id, full_name: data.full_name, phone_number: data.phone_number },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: data, token });
  } catch (err) { next(err); }
}

module.exports = { register, login };
