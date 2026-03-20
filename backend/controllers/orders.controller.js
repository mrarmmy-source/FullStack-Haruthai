const { supabaseAdmin } = require('../config/supabase');

async function getMyOrders(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('profile_id', req.user.id)
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function getAllOrders(req, res, next) {
  try {
    const { status } = req.query;
    let query = supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false });
    if (status && status !== 'all') query = query.eq('status', status);
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function createOrder(req, res, next) {
  try {
    const { customer_name, table_number, items, total } = req.body;
    const { error } = await supabaseAdmin.from('orders').insert([{
      profile_id: req.user?.id ?? null,
      status: 'pending',
      customer_name,
      table_number,
      items,
      total
    }]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Order created' });
  } catch (err) { next(err); }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { error } = await supabaseAdmin.from('orders').update({ status }).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Status updated' });
  } catch (err) { next(err); }
}

module.exports = { getMyOrders, getAllOrders, createOrder, updateOrderStatus };
