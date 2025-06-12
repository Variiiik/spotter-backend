// === server.js ===
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

app.use(cors());
app.use(express.json());

let db;

app.get('/api/drivers', async (req, res) => {
  try {
    const drivers = await db.collection('drivers').find({ competitionClass: 'Pro' }).toArray();
    res.json(drivers);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

app.post('/api/drivers/:id/times', async (req, res) => {
  const { time, note } = req.body;
  try {
    const result = await db.collection('drivers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { times: { time, note } } }
    );
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Failed to add time' });
  }
});

app.listen(port, async () => {
  try {
    await client.connect();
    db = client.db('spotter');
    console.log(`Server running on port ${port}`);
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
});
