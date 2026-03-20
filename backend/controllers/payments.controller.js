const { supabase, supabaseAdmin } = require('../config/supabase');

async function getAllPayments(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('payments')
      .select('*, orders(table_number, status)')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getPaymentByOrderId(req, res, next) {
  try {
    const { order_id } = req.params;
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', order_id)
      .single();
    if (error) return res.status(404).json({ error: 'Payment not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function createPayment(req, res, next) {
  try {
    const { order_id, amount, method } = req.body;
    // method: 'cash' | 'qr' | 'card'

    const { data, error } = await supabase
      .from('payments')
      .insert([{ order_id, amount, method, status: 'pending' }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function confirmPayment(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllPayments, getPaymentByOrderId, createPayment, confirmPayment };
