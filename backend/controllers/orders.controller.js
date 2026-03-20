const { supabase, supabaseAdmin } = require('../config/supabase');

async function getAllOrders(req, res, next) {
  try {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*, menus(name, price))')
      .order('created_at', { ascending: false });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, menus(name, price))')
      .eq('id', id)
      .single();
    if (error) return res.status(404).json({ error: 'Order not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function createOrder(req, res, next) {
  try {
    const { table_number, items, note } = req.body;
    // items: [{ menu_id, quantity }]

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{ table_number, note, status: 'pending' }])
      .select()
      .single();

    if (orderError) return res.status(400).json({ error: orderError.message });

    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_id: item.menu_id,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    if (itemsError) return res.status(400).json({ error: itemsError.message });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('orders').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder };
