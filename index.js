const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
// middleware
app.use(cors())
app.use(express.json())


// mongodb connected

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neggqyg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const papersCollection = client.db('papersDB').collection('papers')
    const userCollection = client.db('userDB').collection('user')

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

    // create mongodb and showing on home page
    app.post('/papers', async (req, res) => {
      const newPaper = req.body;
      console.log(newPaper);
      const result = await papersCollection.insertOne(newPaper)
      res.send(result)
    })

    // user related apis
    app.post('/user', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/craft-details/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await papersCollection.findOne(query);
  res.send(result);
})

app.listen(port, () => {
  console.log(`coffee server is running on port: ${port}`);
})