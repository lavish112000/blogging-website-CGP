/*
  Usage (PowerShell):
    $env:MONGODB_URI = "mongodb+srv://..."; node scripts/check-mongodb.js

  Notes:
  - Reads MONGODB_URI from environment.
  - Does NOT print the URI (to avoid leaking secrets).
*/

const mongoose = require('mongoose');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in environment.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { bufferCommands: false });
    const host = mongoose.connection?.host;
    const name = mongoose.connection?.name;
    console.log('MongoDB connection: OK');
    if (host) console.log(`Host: ${host}`);
    if (name) console.log(`DB: ${name}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection: FAILED');
    if (err && typeof err.message === 'string') {
      // Keep message, but avoid dumping full objects that might include URIs
      console.error(err.message);
    }
    process.exit(1);
  }
}

main();
