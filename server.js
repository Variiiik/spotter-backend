import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import { MongoClient } from 'mongodb';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let db, drivers, driverDetails;

async function connectDB() {
  await client.connect();
  db = client.db('spotter');
  drivers = db.collection('drivers');
  driverDetails = db.collection('driverDetails');
  await drivers.createIndex({ competitorId: 1 }, { unique: true });
  await driverDetails.createIndex({ competitorId: 1 }, { unique: true });
  console.log('🟢 MongoDB ühendatud');
}

app.get('/api/drivers', async (req, res) => {
  try {
    const list = await drivers.aggregate([
      {
        $lookup: {
          from: 'driverDetails',
          localField: 'competitorId',
          foreignField: 'competitorId',
          as: 'details'
        }
      },
      {
        $unwind: {
          path: '$details',
          preserveNullAndEmptyArrays: true
        }
      }
    ]).toArray();

    res.json(list);
  } catch (err) {
    console.error('❌ Viga sõitjate laadimisel:', err);
    res.status(500).send('Laadimine ebaõnnestus');
  }
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
  await drivers.insertOne(newDriver);
  res.status(201).send("Lisatud");
});


app.get('/api/drivers/:id', async (req, res) => {
  const driver = await driverDetails.findOne({ competitorId: req.params.id });
  if (!driver) return res.status(404).send("Sõitjat ei leitud");
  res.json(driver);
});

app.post('/api/drivers/:id/time', async (req, res) => {
  const { id } = req.params;
  const { time, note } = req.body;
  if (typeof time !== 'number') return res.status(400).send("Aeg peab olema number");

  const update = await drivers.updateOne(
    { competitorId: id },
    { $push: { times: { time, note, date: new Date() } } }
  );
  res.json({ modified: update.modifiedCount });
});

app.delete('/api/drivers/:id/times', async (req, res) => {
  const result = await driverDetails.updateOne(
    { competitorId: req.params.id },
    { $set: { times: [] } }
  );

  if (result.modifiedCount === 0) {
    return res.status(404).send('Sõitjat ei leitud või ajad juba tühjad');
  }

  res.status(200).send('Ajad kustutatud');
});
app.post('/api/sync-driver/:class', async (req, res) => {
  const competitionClass = req.params.class;
  if (!["Pro", "Pro2"].includes(competitionClass)) return res.status(400).send("Vigane klass");

  try {
    const listRes = await axios.get(
      'https://driftpoint.net/api/v1/appUsers/filterValues/08dd9ba1-0b2e-491c-8244-03d616b707b7'
    );

    const list = listRes.data[competitionClass];
    if (!Array.isArray(list)) return res.status(500).send("Vigane andmestruktuur API vastuses");

    for (const d of list) {
      const driverDoc = {
        competitorId: d.competitorId,
        competitorName: d.competitorName,
        competitionNumbers: d.competitionNumbers,
        mostCommonNr: d.mostCommonNr,
        nationality: d.nationality,
        competitionClass: d.competitionClass,
        status: d.status ?? 1
      };

      await drivers.updateOne(
        { competitorId: driverDoc.competitorId },
        { $set: driverDoc },
        { upsert: true }
      );

      const detailRes = await axios.get(
        `https://driftpoint.net/api/v1/appUsers/GetUserInfos/${d.competitorId}/2025/08da52ef-5c42-4c8a-82bf-b4b91737683d`
      );

      const detailDoc = {
        competitorId: d.competitorId,
        countryCode: d.nationality,
        car: detailRes.data.car,
        teamName: detailRes.data.teamName,
        tandemsBestResult: detailRes.data.tandemsBestResult,
        qualificationsBestResult: detailRes.data.qualificationsBestResult,
        qualificationsHighestScore: detailRes.data.qualificationsHighestScore
      };

      await driverDetails.updateOne(
        { competitorId: d.competitorId },
        { $set: detailDoc },
        { upsert: true }
      );
    }

    res.json({ success: true, count: list.length });
  } catch (err) {
    console.error('❌ Sünkroniseerimisviga:', err);
    res.status(500).send('Sünkroniseerimine ebaõnnestus');
  }
});

connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server käivitatud: http://localhost:${port}`));
});
