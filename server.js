const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// MongoDB Atlas connection string and connection pool
const uri = "mongodb+srv://doducmanhctb:Manh2710@cluster0.8d4w1lx.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define value1 array and dataStore array
let value1 = [];
let dataStore = [];

// Connect to MongoDB Atlas when the application starts
client.connect()
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas:', error);
  });

// Handle SIGINT (Ctrl+C) to close MongoDB connection gracefully
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit();
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

app.get('/api/data/fetchch4', async (req, res) => {
  try {
    const database = client.db('gas');
    const collection = database.collection('ch4');
    const data = await collection.find({}).sort({ _id: -1 }).limit(5).toArray();
    res.json(data);
    data.reverse();

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data/fetchlpg', async (req, res) => {
  try {
    const database = client.db('gas');
    const collection = database.collection('lpg');
    const data = await collection.find({}).sort({ _id: -1 }).limit(5).toArray();
    res.json(data);
    data.reverse();

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data/fetchcommon', async (req, res) => {
  try {
    const database = client.db('gas');
    const collection = database.collection('common');
    const data = await collection.find({}).sort({ _id: -1 }).limit(5).toArray();
    res.json(data);
    data.reverse();

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const { Concern, Hour, Min, Day, Month, Year, Pin, Gas, Temp, Hump } = req.body;
    console.log(`Received data - Concern: ${Concern}, Hour: ${Hour}, Min: ${Min}, Day:${Day}, Month:${Month}, Year:${Year}, Pin: ${Pin}, Gas:${Gas}, Temp:${Temp}, Hump:${Hump}}`);
    function concatenateTime(hours, minutes, days, months, years) {
      const concatenatedTime = `${hours}:${minutes} ${days}/${months}/${years}`;
      return concatenatedTime;
    }

    const newCommonData = {
      Time: concatenateTime(Hour, Min, Day, Month, Year),
      Pin: Pin,
      Temp: Temp,
      Hump: Hump
    }
    pushcommondata(newCommonData);
    const newInViData = {
      Concern: Concern,
      Time: concatenateTime(Hour, Min, Day, Month, Year),
      Gas: Gas,
    };
    if (newInViData.Gas == 0) {
      await pushdatatoch4(newInViData);
    } else {
      await pushdatatolpg(newInViData);
    }
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error handling data:', error);
    res.status(500).send('Internal Server Error');
  }
});

async function pushcommondata(newData) {
  try {
    const database = client.db('gas');
    const collection = database.collection('common');
    await collection.insertOne(newData);
    console.log('Data inserted:', newData);
  } catch (error) {
    console.error('Error pushing data to MongoDB:', error);
  }
}

async function pushdatatoch4(newData) {
  try {
    const database = client.db('gas');
    const collection = database.collection('ch4');
    await collection.insertOne(newData);
    console.log('Data inserted:', newData);
  } catch (error) {
    console.error('Error pushing data to MongoDB:', error);
  }
}

async function pushdatatolpg(newData) {
  try {
    const database = client.db('gas');
    const collection = database.collection('lpg');
    await collection.insertOne(newData);
    console.log('Data inserted:', newData);
  } catch (error) {
    console.error('Error pushing data to MongoDB:', error);
  }
}

app.post('/api/control', (req, res) => {
  try {
    const { value } = req.body;
    value1.shift();
    value1.push({ value });
    console.log('Received control value:', value);
    res.status(200).send('Control signal received');
  } catch (error) {
    console.error('Error handling control signal:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/control', (req, res) => {
  res.json(value1);
});

app.get('/api/data', (req, res) => {
  res.json(dataStore);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
