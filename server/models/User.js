const mongoose = require('mongoose');
const { isMongoConnected, localDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Vinyl Admin' },
  role: { type: String, enum: ['admin', 'listener'], default: 'admin' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80' },
  createdAt: { type: Date, default: Date.now }
});

const MongoUser = mongoose.model('User', userSchema);

const User = {
  async findOne(query) {
    if (isMongoConnected()) {
      return await MongoUser.findOne(query);
    }
    const db = localDB.read();
    return (db.users || []).find(u => {
      if (query.email) return u.email.toLowerCase() === query.email.toLowerCase();
      if (query._id) return u._id === query._id || u.id === query._id;
      return false;
    }) || null;
  },

  async create(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    if (isMongoConnected()) {
      const doc = new MongoUser({ ...userData, password: hashedPassword });
      return await doc.save();
    }
    const db = localDB.read();
    const newUser = {
      _id: uuidv4(),
      id: uuidv4(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    if (!db.users) db.users = [];
    db.users.push(newUser);
    localDB.write(db);
    return newUser;
  },

  async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
};

module.exports = User;
