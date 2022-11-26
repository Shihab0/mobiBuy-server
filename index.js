const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

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
const productsCollection = client.db("mobiBuy").collection("products");
const usersCollection = client.db("mobiBuy").collection("users");

/////////////////////// USER OPERATION /////////////////////////
app.post("/users", async (req, res) => {
  const users = req.body;
  const result = await usersCollection.insertOne(users);
  res.send(result);
});

//////////////////// LOAD CATEGORIES /////////////////////////////
app.get("/categories", async (req, res) => {
  const query = {};
  const categories = await categoryCollection.find(query).toArray();
  res.send(categories);
});

///////////////////// DISPLAY PRODUCTS ////////////////////////////
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  const query = {
    category_id: id,
  };
  const products = await productsCollection.find(query).toArray();
  res.send(products);
});

//////////////////////// ADD PRODUCT ////////////////////////////////
app.post("/addProduct", async (req, res) => {
  const product = req.body;
  const result = await productsCollection.insertOne(product);
  console.log(product);
  res.send(result);
});

///////////////////// GET / DELETE / UPDATE  SELLER PRODUCTS ///////////////
app.get("/dashboard/myProducts", async (req, res) => {
  const email = req.query.email;
  console.log(email);
  const query = { email: email };
  const products = await productsCollection.find(query).toArray();
  res.send(products);
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
