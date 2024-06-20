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
    const database = client.db('datn');
    const collection = database.collection('device1');
    const data = await collection.find({}).sort({ _id: -1 }).limit(10).toArray();
    res.json(data);
    data.reverse();

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/data/fetchlpg', async (req, res) => {
  try {
    const database = client.db('datn');
    const collection = database.collection('device2');
    const data = await collection.find({}).sort({ _id: -1 }).limit(10).toArray();
    res.json(data);
    data.reverse();

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/api/data', async (req, res) => {
  try {
    const { ID, Value, Hour, Min, Date, Month, Year, Arlert, Temp, Hump} = req.body;
    console.log(`Received data - {ID: ${ID}; Value: ${Value}, Hour: ${Hour}, Min: ${Min}, Date:${Date}, Month:${Month}, Year:${Year}, Arlert:${Arlert}, Temp:${Temp}, Hump:${Hump}}`);
    function concatenateTime(hours, minutes, days, months, years) {
      const hoursStr = String(hours).padStart(2, '0');
      const minutesStr = String(minutes).padStart(2, '0');
      const daysStr = String(days).padStart(2, '0');
      const monthsStr = String(months).padStart(2, '0');
      const yearsStr = String(years).padStart(4, '20');
      const concatenatedTime = `${hoursStr}:${minutesStr} ${daysStr}/${monthsStr}/${yearsStr}`;
      return concatenatedTime;
    }

    const newInViData = {
      Value: Value,
      Time: concatenateTime(Hour, Min, Date, Month, Year),
      Arlert: Arlert,
      Temp: Temp,
      Hump: Hump,
      Device: ID,
    };
    if (newInViData.Device == 1) {
      await pushdatato1(newInViData);
    } else if (newInViData.Device == 2){
      await pushdatato2(newInViData);
    }
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Error handling data:', error);
    res.status(500).send('Internal Server Error');
  }
});


async function pushdatato1(newData) {
  try {
    const database = client.db('datn');
    const collection = database.collection('device1');
    await collection.insertOne(newData);
    console.log('Data inserted:', newData);
  } catch (error) {
    console.error('Error pushing data to MongoDB:', error);
  }
}

async function pushdatato2(newData) {
  try {
    const database = client.db('datn');
    const collection = database.collection('device2');
    await collection.insertOne(newData);
    console.log('Data inserted:', newData);
  } catch (error) {
    console.error('Error pushing data to MongoDB:', error);
  }
}

app.get('/api/data', (req, res) => {
  res.json(dataStore);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
