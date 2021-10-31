const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
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

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aneek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        console.log("connected");
        const database = client.db('arcane-travel');
        const packagesCollection = database.collection('packages');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('reviews');

        //GET packages
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages);
        })

        //GET reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.json(reviews);
        })

        //GET ALL ORDER
        app.get('/allOrder', async (req, res) => {
            const cursor = orderCollection.find({});
            const allOrder = await cursor.toArray();
            res.json(allOrder);
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

        // add Package
        app.post("/addPackage", async (req, res) => {
            const addPackage = req.body;
            const result = await packagesCollection.insertOne(addPackage);
            console.log(result);
            res.json(result);
        });


        // delete package

        app.delete("/deletePackage/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.json(result);
        });


        //UPDATE API
        app.put("/allOrder/:id", async (req, res) => {
            const id = req.params.id;
            console.log("updated", id);
            res.send('updating');
            // const updatedStatus = req.body;
            // const filter = { _id: ObjectId(id) };
            // const options = { upsert: true };
            // const updateDoc = {
            //     $set: {
            //         status: updatedStatus.status
            //     },
            // };
            // const result = await orderCollection.updateOne(filter, updateDoc, options);
            // // console.log('updated', id,req);
            // res.json(result);

        })

        // my order

        app.get("/myOrder/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.json(result);
        });
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