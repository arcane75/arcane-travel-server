const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
//arcanetravel
//TxwteBG01k4ezzom

// const uri = 'mongodb+srv://arcanetravel:TxwteBG01k4ezzom@cluster0.swu9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const uri = "mongodb+srv://arcanetravel:TxwteBG01k4ezzom@cluster0.aneek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("connected");
        const database = client.db('arcane-travel');
        const packagesCollection = database.collection('packages');
        const orderCollection = database.collection('order');

        //GET API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages);
        })


        // Use POST to get data by keys
        app.post('/packages/byKey', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const packages = await packagesCollection.find(query).toArray();
            res.json(packages);
        });

        // Add Orders API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('arcane travel server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})