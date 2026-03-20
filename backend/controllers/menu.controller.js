const { supabaseAdmin } = require('../config/supabase');

async function getAllMenus(req, res, next) {
  try {
    let query = supabaseAdmin.from('menus').select('*').order('category');
    if (req.query.available === 'true') query = query.eq('is_available', true);
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data ?? []);
  } catch (err) { next(err); }
}

async function createMenu(req, res, next) {
  try {
    const { error } = await supabaseAdmin.from('menus').insert([req.body]);
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Menu created' });
  } catch (err) { next(err); }
}

async function updateMenu(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('menus').update(req.body).eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Menu updated' });
  } catch (err) { next(err); }
}

async function deleteMenu(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('menus').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Menu deleted' });
  } catch (err) { next(err); }
}

module.exports = { getAllMenus, createMenu, updateMenu, deleteMenu };
