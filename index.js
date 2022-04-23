const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware

app.use(cors());
app.use(express.json());

//mongodb password and user name

// userName : dbIUser00
// Password :q7sJoxT85wOx84hH



//db setup 



const uri = "mongodb+srv://dbIUser00:q7sJoxT85wOx84hH@cluster0.9x7m2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     const collection = client.db("foodExpress").collection("users");
//     console.log('db connect');
//     // perform actions on the collection object
//     client.close();
// });



async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection('users');

        // get api
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        });

        // get single user

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);

        });


        //post api
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser);
            console.log('adding new user', result.insertedId);
            res.send(result);
        });


        //delete user 
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        // update user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email,
                    phone: updateUser.phone,
                }
            };
            const result = await userCollection.updateOne(query, updateDoc, options);
            res.send(result);

        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


//create api into route

app.get('/', (req, res) => {
    res.send("server is running");

});

app.listen(port, () => {
    console.log("CURD server is running", port);
})