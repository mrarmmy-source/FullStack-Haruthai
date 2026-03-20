const { supabaseAdmin } = require('../config/supabase');

async function getMyPayments(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('profile_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function getAllPayments(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function createPayment(req, res, next) {
  try {
    const { customer_name, amount, method, status } = req.body;
    const { error } = await supabaseAdmin
      .from('payments')
      .insert([{ profile_id: req.user.id, customer_name, amount, method, status }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Payment created' });
  } catch (err) { next(err); }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { error } = await supabaseAdmin.from('payments').update({ status }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
}

async function updatePaymentStatusByCustomer(req, res, next) {
  try {
    const { from_status, to_status } = req.body;
    const { error } = await supabaseAdmin
      .from('payments')
      .update({ status: to_status })
      .eq('profile_id', req.user.id)
      .eq('status', from_status);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
}

module.exports = { getMyPayments, getAllPayments, createPayment, updatePaymentStatus, updatePaymentStatusByCustomer };
