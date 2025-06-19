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

//const client = new MongoClient(process.env.MONGO_URI);
//let db, drivers, driverDetails;

const proDrivers = [
  { competitorId: "pro-1", competitorName: "JANUŠAUSKAITĖ Sandra", nationality: "LTU", car: "BMW F22", competitionClass: "PRO" },
  { competitorId: "pro-2", competitorName: "FABISIAK Dariusz", nationality: "POL", car: "Nissan 200SX S14", competitionClass: "PRO" },
  { competitorId: "pro-3", competitorName: "WARTAŁOWICZ Marek", nationality: "POL", car: "Nissan PS13", competitionClass: "PRO" },
  { competitorId: "pro-4", competitorName: "MLADENOV Samuel", nationality: "SVK", car: "BMW E92", competitionClass: "PRO" },
  { competitorId: "pro-5", competitorName: "FIJAŁ Aleksandra", nationality: "POL", car: "Nissan S13 200SX", competitionClass: "PRO" },
  { competitorId: "pro-6", competitorName: "MERILOO Graig", nationality: "EST", car: "BMW Presision next gen", competitionClass: "PRO" },
  { competitorId: "pro-7", competitorName: "WAAGAARD Joachim", nationality: "NOR", car: "BMW M4", competitionClass: "PRO" },
  { competitorId: "pro-8", competitorName: "KUR Dominik", nationality: "POL", car: "Opel GT", competitionClass: "PRO" },
  { competitorId: "pro-9", competitorName: "HEIDRICH Tim", nationality: "POL", car: "Mercedes Benz", competitionClass: "PRO" },
  { competitorId: "pro-10", competitorName: "OLEJNIK Jacek", nationality: "POL", car: "BMW E92", competitionClass: "PRO" },
  { competitorId: "pro-11", competitorName: "ZAKRZEWSKI Mikołaj", nationality: "POL", car: "Nissan Silvia S15", competitionClass: "PRO" },
  { competitorId: "pro-12", competitorName: "STOLARSKI Bartosz", nationality: "POL", car: "Nissan 200SX S15", competitionClass: "PRO" },
  { competitorId: "pro-13", competitorName: "ERLANDSSON Christian", nationality: "SWE", car: "Subaru BRZ", competitionClass: "PRO" },
  { competitorId: "pro-14", competitorName: "PILARCZYK Karolina", nationality: "POL", car: "Nissan 200SX S15", competitionClass: "PRO" },
  { competitorId: "pro-15", competitorName: "JARKIEWICZ Maciej", nationality: "POL", car: "Nissan S14", competitionClass: "PRO" },
  { competitorId: "pro-16", competitorName: "UTASI Péter", nationality: "HUN", car: "BMW F22", competitionClass: "PRO" },
  { competitorId: "pro-17", competitorName: "KOZŁOWSKI Piotr", nationality: "POL", car: "Nissan Silvia S15", competitionClass: "PRO" },
  { competitorId: "pro-18", competitorName: "STAŃCZAK Piotr", nationality: "POL", car: "BMW E82", competitionClass: "PRO" },
  { competitorId: "pro-19", competitorName: "PRZYGOŃSKI Jakub", nationality: "POL", car: "Toyota GR86", competitionClass: "PRO" },
  { competitorId: "pro-20", competitorName: "FOJTÍK Michal", nationality: "CZE", car: "BMW M3 E46 V8 Turbo", competitionClass: "PRO" },
  { competitorId: "pro-21", competitorName: "ALHARBALI URIAS Nasser", nationality: "SLV", car: "Nissan S13", competitionClass: "PRO" },
  { competitorId: "pro-22", competitorName: "SALMRE Kristjan", nationality: "EST", car: "BMW 1", competitionClass: "PRO" },
  { competitorId: "pro-23", competitorName: "WROBEL Kevin", nationality: "POL", car: "BMW E36", competitionClass: "PRO" },
  { competitorId: "pro-24", competitorName: "JÓŹWIAK Krzysztof", nationality: "POL", car: "BMW F22", competitionClass: "PRO" },
  { competitorId: "pro-25", competitorName: "SHEVELOV Valerii", nationality: "UKR", car: "Nissan S13", competitionClass: "PRO" },
  { competitorId: "pro-26", competitorName: "MICHALCZUK Orest", nationality: "POL", car: "Nissan 200SX", competitionClass: "PRO" },
  { competitorId: "pro-27", competitorName: "DOROZIŃSKI Fabian", nationality: "ISL", car: "Nissan S14 200SX", competitionClass: "PRO" },
  { competitorId: "pro-28", competitorName: "DRUZSIN Matyas", nationality: "HUN", car: "BMW M104 Turbo", competitionClass: "PRO" },
  { competitorId: "pro-29", competitorName: "WETTEMARK Viktor", nationality: "SWE", car: "Nissan S14.9", competitionClass: "PRO" },
  { competitorId: "pro-30", competitorName: "KRÓL Jakub", nationality: "POL", car: "Nissan 200SX S14", competitionClass: "PRO" },
  { competitorId: "pro-31", competitorName: "NEJMAN Marcin", nationality: "POL", car: "BMW F22", competitionClass: "PRO" },
  { competitorId: "pro-32", competitorName: "HORECKI Kamil", nationality: "POL", car: "BMW E82", competitionClass: "PRO" },
  { competitorId: "pro-33", competitorName: "KADEŘÁBEK Zdeněk", nationality: "CZE", car: "BMW E46", competitionClass: "PRO" },
  { competitorId: "pro-34", competitorName: "ANDERSSON Viktor", nationality: "SWE", car: "Toyota GT86", competitionClass: "PRO" },
  { competitorId: "pro-35", competitorName: "SUSKI Mateusz", nationality: "POL", car: "Toyota Supra", competitionClass: "PRO" },
  { competitorId: "pro-36", competitorName: "WILCZEK Łukasz", nationality: "POL", car: "BMW M3 E46", competitionClass: "PRO" },
  { competitorId: "pro-37", competitorName: "HAVRYLENKO Artur", nationality: "UKR", car: "Toyota GT86", competitionClass: "PRO" },
  { competitorId: "pro-38", competitorName: "BERTRAND Denis", nationality: "BEL", car: "BMW E46", competitionClass: "PRO" },
  { competitorId: "pro-39", competitorName: "HAMWY Michel", nationality: "SWE", car: "Nissan S14", competitionClass: "PRO" },
  { competitorId: "pro-40", competitorName: "HUDECEK Pavel", nationality: "CZE", car: "Nissan", competitionClass: "PRO" },
  { competitorId: "pro-41", competitorName: "KONEČNÝ Jan", nationality: "CZE", car: "BME E36", competitionClass: "PRO" },
  { competitorId: "pro-42", competitorName: "FIJAŁ Mateusz", nationality: "POL", car: "Toyota GT86", competitionClass: "PRO" },
  { competitorId: "pro-43", competitorName: "HOMAN Zsolt", nationality: "HUN", car: "Nissan S13", competitionClass: "PRO" },
  { competitorId: "pro-44", competitorName: "ANDREASEN Mads", nationality: "DNK", car: "BMW M3", competitionClass: "PRO" },
  { competitorId: "pro-45", competitorName: "MAGYAR Tamás", nationality: "HUN", car: "Mercedes E190", competitionClass: "PRO" },
  { competitorId: "pro-46", competitorName: "PAWLONKA Krzysztof", nationality: "POL", car: "Nissan S15", competitionClass: "PRO" },
  { competitorId: "pro-47", competitorName: "KOSZYCARZ Krzysztof", nationality: "POL", car: "BMW F22", competitionClass: "PRO" },
  { competitorId: "pro-48", competitorName: "REICHERT Michal", nationality: "CZE", car: "BMW E36", competitionClass: "PRO" },
  { competitorId: "pro-49", competitorName: "TASIEMSKI Łukasz", nationality: "POL", car: "Nissan 200SX", competitionClass: "PRO" },
  { competitorId: "pro-50", competitorName: "SOUHRADA Lukáš", nationality: "CZE", car: "BMW E92", competitionClass: "PRO" }
];

//async function connectDB() {
//  await client.connect();
//  db = client.db('spotter');
//  drivers = db.collection('drivers');
//  driverDetails = db.collection('driverDetails');
//  await drivers.createIndex({ competitorId: 1 }, { unique: true });
//  await driverDetails.createIndex({ competitorId: 1 }, { unique: true });
//  console.log('🟢 MongoDB ühendatud');
//}

//app.get('/api/drivers', async (req, res) => {
//  try {
//    const list = await drivers.aggregate([
//      {
//        $lookup: {
//          from: 'driverDetails',
//          localField: 'competitorId',
//          foreignField: 'competitorId',
//          as: 'details'
//        }
//      },
//      {
//        $unwind: {
//          path: '$details',
//          preserveNullAndEmptyArrays: true
//        }
//      }
//    ]).toArray();

//    res.json(list);
//  } catch (err) {
//    console.error('❌ Viga sõitjate laadimisel:', err);
//    res.status(500).send('Laadimine ebaõnnestus');
//  }
//});
app.get('/api/drivers', (req, res) => {
  res.json(proDrivers);
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
  const id = req.params.id;
  try {
    await db.collection('drivers').updateOne(
      { competitorId: id },
      { $set: { times: [] } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Aegade kustutamine ebaõnnestus:', err);
    res.status(500).send('Serveri viga');
  }
});
// Lisa see olemasolevate app.* käsuridade sekka
app.delete('/api/drivers/:id/time/:timestamp', async (req, res) => {
  const { id, timestamp } = req.params;

  try {
    const targetTime = new Date(Number(timestamp)); // teisenda number -> Date

    const result = await drivers.updateOne(
      { competitorId: id },
      { $pull: { times: { date: targetTime } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Aega ei leitud või juba kustutatud.' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Viga aja kustutamisel:', err);
    res.status(500).json({ message: 'Serveri viga' });
  }
});

app.post('/api/sync-driver/:class', async (req, res) => {
  const competitionClass = req.params.class;
  //if (!["Pro", "Pro2"].includes(competitionClass)) return res.status(400).send("Vigane klass");
  if (competitionClass !== "Pro") return res.status(400).send("Ainult Pro klass lubatud");

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

app.get('/api/analysis/top', async (req, res) => {
  try {
    const allDrivers = await drivers
      .find({ times: { $exists: true, $not: { $size: 0 } } })
      .toArray();

    const result = allDrivers.map(driver => {
      const times = driver.times || [];
      const sorted = [...times].sort((a, b) => new Date(a.date) - new Date(b.date));
      const timeValues = sorted.map(t => t.time);

      let bestAvg3 = null;
      if (timeValues.length >= 3) {
        bestAvg3 = Infinity;
        for (let i = 0; i <= timeValues.length - 3; i++) {
          const avg = (timeValues[i] + timeValues[i + 1] + timeValues[i + 2]) / 3;
          if (avg < bestAvg3) bestAvg3 = avg;
        }
      }

      return {
        competitorName: driver.competitorName,
        competitionNumbers: driver.competitionNumbers,
        bestTime: Math.min(...timeValues),
        averageTime: timeValues.reduce((sum, val) => sum + val, 0) / timeValues.length,
        attemptCount: timeValues.length,
        bestConsecutiveAvg3: Number.isFinite(bestAvg3) ? bestAvg3 : null
      };
    });

    result.sort((a, b) => a.bestTime - b.bestTime);

    res.json(result);
  } catch (err) {
    console.error('❌ Analüüsi viga:', err);
    res.status(500).send("Analüüsi laadimine ebaõnnestus");
  }
});


app.patch('/api/drivers/:id/note', async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  try {
    const result = await drivers.updateOne(
      { competitorId: id },
      { $set: { note: note || '' } }
    );
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Märkuse salvestus error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});





//connectDB().then(() => {
  app.listen(port, () => console.log(`🚀 Server käivitatud: http://localhost:${port}`));
//});
