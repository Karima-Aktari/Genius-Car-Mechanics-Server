const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//User:: geniusMechanic
//Password:: AKFcPq5w3VaUkak7

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0mt6g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database');
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        //GET API //Show All Services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET Single Services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('Service hitted', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //POST API //connect the clint-side
        app.post('/services', async (req, res) => {
            const service = req.body;
            // console.log('Hit the post', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        //DELETE SERVICE
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius car');
});

app.listen(port, () => {
    console.log('Running Successfully Port', port);
})