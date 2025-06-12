import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db, drivers;

async function connectDB() {
  await client.connect();
  db = client.db('spotter');
  drivers = db.collection('drivers');
  console.log('🟢 MongoDB ühendatud');
}

app.get('/api/drivers', async (req, res) => {
  const list = await drivers.find({}).toArray();
  res.json(list);
});

app.post('/api/drivers', async (req, res) => {
  const { name } = req.body;
  const newDriver = { name, times: [], running: false, startTime: null };
  await drivers.insertOne(newDriver);
  res.json(newDriver);
});

app.put('/api/drivers/:name', async (req, res) => {
  const { name } = req.params;
  const { times, running, startTime } = req.body;
  await drivers.updateOne({ name }, { $set: { times, running, startTime } });
  res.json({ success: true });
});

app.delete('/api/drivers/:name', async (req, res) => {
  const { name } = req.params;
  await drivers.deleteOne({ name });
  res.json({ success: true });
});

connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server käivitati: http://localhost:${port}`));
});
