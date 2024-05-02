require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())


// mongodb connected

const uri = `mongodb+srv://${ process.env.DB_USER }:${ process.env.DB_PASS }@cluster0.neggqyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const papersCollection = client.db('papersDB').collection('papers')
const userCollection = client.db('papersDB').collection('user')

// for showing ui
app.get('/papers', async (req, res) => {
  const cursor = papersCollection.find();
  const result = await cursor.toArray();
  res.send(result)
})

// showing view detail page
app.get('/paper/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await papersCollection.findOne(query);
  res.send(result)
})

// new added
app.get('/craft-details/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await papersCollection.findOne(query);
  res.send(result);
})

// showing email
app.get('/papers/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email }
  const result = await papersCollection.find(query).toArray();
  res.send(result);
})


// create mongodb and showing on home page
app.post('/papers', async (req, res) => {
  const newPaper = req.body;
  console.log(newPaper);
  const result = await papersCollection.insertOne(newPaper)
  res.send(result)
})

app.get('/user', async (req, res) => {
  const cursor = userCollection.find();
  const users = await cursor.toArray();
  res.send(users)
})

app.post('/user', async (req, res) => {
  const user = req.body;
  console.log(user);
  const result = await userCollection.insertOne(user)
  res.send(result)
})


app.delete('/paper/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await papersCollection.deleteOne(query)
  res.send(result)
})


app.put('/update/:id', async (req, res) => {
  const updatePapers = req.body;
  const id = req.params.id;
  console.log(id);
  const filter = { _id: new ObjectId(id) }
  const options = { upsert: true };
  const updateDoc = {
    $set: updatePapers
  }
  const result = await papersCollection.updateOne(filter, updateDoc, options);
  res.send(result);
})





app.listen(port, () => {
  console.log(`Papers server is running on port: ${ port }`);
})
