const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uyt0da0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)


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

    const usersCollection = client.db('usersDB').collection('users');
    // const artcraftCollection = client.db('artcraftDB').collection('artcraft')

    app.get('/users', async(req, res) => {
        const cursor = usersCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

   
    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.findOne(query);
      res.send(result);
    })
    
    app.get("/featuredSixCrafts", async(req,res)=>{
      const data = await usersCollection.find().limit(6).toArray()
      res.send(data)
      })

      
    app.get('/users/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await usersCollection.findOne(query);
      res.send(result);
    })

    
    app.get('/artcraft/:email', async(req, res) => {
      console.log(req.params.email)
      const result = await usersCollection.find({email:req.params.email}).toArray();
     console.log(result)
      res.send(result)
    })

    app.post('/users', async(req, res) =>{
        const newUser = req.body;
        console.log(newUser);
        const result = await usersCollection.insertOne(newUser);
        res.send(result); 
    })

    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedItem = req.body;
      const item = {
        $set: {
          item: updatedItem.item,
           subcategory: updatedItem.subcategory,
           description: updatedItem.description,
           image: updatedItem.image,
            price: updatedItem.price,
            rating: updatedItem.rating, 
            processing: updatedItem.processing, 
            customization: updatedItem.customization,
             stock: updatedItem.stock
        }
      }
      const result = await usersCollection.updateOne(filter, item, options)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.log);


app.get('/', (req, res) => {
    res.send('assigment server is running')
})

app.listen(port, () =>{
    console.log(`assigment server is running on port:${port}`)
})