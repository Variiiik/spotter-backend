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
  const drivers = await db.collection('drivers').find({ competitionClass: 'Pro' }).toArray();
  res.json(drivers);
});

app.post('/api/drivers', async (req, res) => {
  const { competitorName } = req.body;
  if (!competitorName) return res.status(400).send("Nimi puudub");
  const newDriver = {
    competitorId: crypto.randomUUID(),
    competitorName,
    competitionNumbers: "",
    mostCommonNr: null,
    nationality: "EE",
    competitionClass: "Pro",
    status: 1
  };
  await db.collection('drivers').insertOne(newDriver);
  res.status(201).send("Lisatud");
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
