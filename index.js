const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("bson");
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6tx1s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(express.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});


client.connect((err) => {
  const serviceCollection = client.db("services").collection("item");
  console.log("db connection successfully");


  app.get("/service", (req, res) => {
    serviceCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
  });


  //add single service 
  app.get("/service/:id", (req, res) => {
    const id = ObjectId(req.params.id)
    serviceCollection.find({_id:id})
    .toArray((err,items)=>{
      res.send(items)
    })
  });

  app.post("/addService", (req, res) => {
    const newService = req.body;
    console.log(newService);
    serviceCollection.insertOne(newService).then((result) => {
      res.send(result.insertedCount > 0);
    })
  });




});

app.listen(process.env.PORT || port);
