import mongoose from "mongoose";
import 'dotenv/config';

const mongoDB = process.env.MONGODB;

mongoose.connect(mongoDB, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));