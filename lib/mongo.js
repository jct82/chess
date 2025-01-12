import { cache } from 'react';

const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://jc:root@cluster0.1yr0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

let cachedClient = null;
let cachedDb = null;

if (!process.env.MONGO_URI) {
  throw new Error(
    'Pas de variable MONGO_URI dans process.env'
  )
}

if (!process.env.MONGO_DB) {
  throw new Error(
    'Pas de variable MONGO_DB dans process.env'
  )
}

export async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb}
  }
  
  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const db = client.db(process.env.MONGO_DB);

  cachedClient = client;
  cachedDb = db;

  return {client, db}
}