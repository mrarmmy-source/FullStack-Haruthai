const { supabaseAdmin } = require('../config/supabase');

async function createBooking(req, res, next) {
  try {
    const { error } = await supabaseAdmin.from('bookings').insert([{
      profile_id: req.user.id,
      ...req.body
    }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Booking created' });
  } catch (err) { next(err); }
}

async function getMyBookings(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .eq('profile_id', req.user.id)
      .order('booking_date', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function getAllBookings(req, res, next) {
  try {
    const { status } = req.query;
    let query = supabaseAdmin
      .from('bookings')
      .select('*, profiles(full_name, phone_number)')
      .order('booking_date', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { error } = await supabaseAdmin.from('bookings').update({ status }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
}

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
