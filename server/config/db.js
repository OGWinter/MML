const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isMongo = false;
const dataFile = path.join(__dirname, '../data/db.json');

// Ensure data folder and file exists
if (!fs.existsSync(path.dirname(dataFile))) {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
}
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({ tracks: [], users: [] }, null, 2));
}

// Local JSON DB Helper
const localDB = {
  read() {
    try {
      const raw = fs.readFileSync(dataFile, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return { tracks: [], users: [] };
    }
  },
  write(data) {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || process.env.USE_MONGO !== 'true') {
    isMongo = false;
    console.log('⚡ Operating with High-Performance Persistent Storage Engine (JSON/Embedded).');
    return;
  }

  try {
    mongoose.connection.on('error', (err) => {
      console.warn('MongoDB connection notice:', err.message);
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500,
      autoIndex: false
    });
    isMongo = true;
    console.log('✅ Connected to MongoDB database successfully.');
  } catch (err) {
    isMongo = false;
    console.log('⚡ MongoDB not detected. Operating seamlessly with Persistent Local Storage mode.');
  }
};

module.exports = {
  connectDB,
  isMongoConnected: () => isMongo,
  localDB
};
