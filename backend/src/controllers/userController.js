import User from '../models/user.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export default { getAllUsers }; 