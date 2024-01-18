import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function init() {
  const mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  mongoose.connect(mongoUri);

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEOUT') {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });

  mongoose.connection.once('open', () => {
    console.log(`Successfully connected to ${mongoUri}`)
  })
}