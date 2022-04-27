const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ck7gi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const eventCollection = client.db("volunteerHelpingHand").collection("events");
        const volunteerActivityCollection = client.db("volunteerHelpingHand").collection("volunteerActivity");

        // get api
        app.get('/events', async (req, res) => {
            const query = {};
            const cursor = eventCollection.find(query);
            const events = await cursor.toArray();
            res.send(events)
        })

        // post api
        app.post('/event', async (req, res) => {
            const body = req.body;
            const result = await eventCollection.insertOne(body);
            res.send(result)
        })

        app.post('/registration', async (req, res) => {
            const body = req.body;
            const result = await volunteerActivityCollection.insertOne(body);
            res.send(result)
        })

        app.get('/registrationall', async (req, res) => {
            const query = {};
            const cursor = volunteerActivityCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        })
        app.get('/registration', async (req, res) => {
            const email = req.query.email;
            const query = { email };
            const cursor = volunteerActivityCollection.find(query);
            const data = await cursor.toArray();
            res.send(data);
        })

        // use post to get products by ids
        app.post('/eventById', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id));
            const query = { _id: { $in: ids } };
            const cursor = eventCollection.find(query);
            const events = await cursor.toArray();
            res.send(events);
        })

    }
    finally {

    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Volunteer activities is continued')
})
app.listen(port, () => {
    console.log('Listening Port is', port);
})