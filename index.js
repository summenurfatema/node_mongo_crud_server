const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// b8QEoRwfP7RCoQR4
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://dbuser02:b8QEoRwfP7RCoQR4@cluster0.6v5oj5d.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db('nodeMongoCrud').collection('users');

        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const users = await cursor.toArray();
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await userCollection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedUser, option)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
    }
    catch {

    }
}
run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello from node mongo crud server')

})
app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})