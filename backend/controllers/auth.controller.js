const { supabase } = require('../config/supabase');

async function signUp(req, res, next) {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ user: data.user });
  } catch (err) {
    next(err);
  }
}

async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(401).json({ error: error.message });
    res.json({ user: data.user, session: data.session });
  } catch (err) {
    next(err);
  }
}

async function signOut(req, res, next) {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ message: 'Signed out successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { signUp, signIn, signOut };
