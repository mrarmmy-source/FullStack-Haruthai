const { supabase } = require('../config/supabase');

async function getAllMenus(req, res, next) {
  try {
    const { data, error } = await supabase.from('menus').select('*').order('created_at', { ascending: true });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getMenuById(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('menus').select('*').eq('id', id).single();
    if (error) return res.status(404).json({ error: 'Menu not found' });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function createMenu(req, res, next) {
  try {
    const { name, description, price, category, image_url, available } = req.body;
    const { data, error } = await supabase
      .from('menus')
      .insert([{ name, description, price, category, image_url, available }])
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function updateMenu(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('menus').update(updates).eq('id', id).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function deleteMenu(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('menus').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Menu deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMenus, getMenuById, createMenu, updateMenu, deleteMenu };
