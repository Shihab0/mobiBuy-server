const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express());

/////////// MONGODB CONNECT WITH SERVER /////////////
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ueibnfi.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const mongodbConnect = () => {
  try {
    client.connect();
    console.log("mongodb connected");
  } catch (err) {
    console.log(err);
  }
};
mongodbConnect();

////////////////// MONGODB COLLECTION ///////////////////////
const categoryCollection = client.db("mobiBuy").collection("categories");

//////////////////// LOAD CATEGORIES /////////////////////////////
app.get("/categories", async (req, res) => {
  const query = {};
  const categories = await categoryCollection.find(query).toArray();
  res.send(categories);
});

//////////////////////////////////////////////////////////////////
/// END  ///
//////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
