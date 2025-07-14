// pages/api/users.js

import connectMongo from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  await connectMongo();

  if (req.method === 'GET') {
    try {
      const users = await User.find();
      res.status(200).json(users); // ✅ Return plain array
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email } = req.body;
      const newUser = await User.create({ name, email });
      res.status(201).json(newUser); // ✅ Return single user directly
    } catch (error) {
      res.status(400).json({ error: 'Failed to create user' });
    }
  }
}
