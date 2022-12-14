const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const { query } = require("express");
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
const bookingsCollection = client.db("mobiBuy").collection("bookings");

/////////////////////// USER OPERATION /////////////////////////
app.post("/users", async (req, res) => {
  const users = req.body;
  const result = await usersCollection.insertOne(users);
  res.send(result);
});

app.get("/seller", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const result = await usersCollection.find(query).toArray();
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
  const products = await (
    await productsCollection.find(query).toArray()
  ).reverse();
  res.send(products);
});

//////////////////////// ADD PRODUCT & GET////////////////////////////////
app.post("/addProduct", async (req, res) => {
  const product = req.body;
  const result = await productsCollection.insertOne(product);
  res.send(result);
});

app.put("/boost/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      advertised: true,
    },
  };
  const result = await productsCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

app.get("/advertised/", async (req, res) => {
  const advertised = Boolean(req.query.advertised);
  const query = { advertised: advertised };
  const advertisedProducts = (
    await productsCollection.find(query).toArray()
  ).reverse();
  res.send(advertisedProducts);
});

app.get("/dashboard/reported", async (req, res) => {
  const query = { reported: "reported" };
  const reportedProduct = await productsCollection.find(query).toArray();
  res.send(reportedProduct);
});

app.put("/makeReport/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      reported: "reported",
    },
  };
  const result = await productsCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

app.get("/myOrders", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const myOrders = (await bookingsCollection.find(query).toArray()).reverse();
  res.send(myOrders);
});
////////////////////   USER INFORMATION UPDATE / GET / DELETE ///////////////
app.get("/dashboard", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const loadedUser = await usersCollection.findOne(query);
  res.send(loadedUser);
});

app.get("/dashboard/users", async (req, res) => {
  const query = {};
  const users = await (await usersCollection.find(query).toArray()).reverse();
  res.send(users);
});

app.put("/users/makeAdmin/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      role: "admin",
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

app.put("/seller/makeVerify/:id", async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      verified: "true",
    },
  };
  const result = await usersCollection.updateOne(filter, updateDoc, options);
  res.send(result);
});

app.delete("/user/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await usersCollection.deleteOne(query);
  res.send(result);
});

app.delete("/product/deleteReported/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await productsCollection.deleteOne(query);
  res.send(result);
});

app.delete("/myProduct/delete/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: ObjectId(id) };
  const result = await productsCollection.deleteOne(query);
  res.send(result);
});

///////////////////// GET / DELETE / UPDATE  SELLER PRODUCTS ///////////////
app.get("/dashboard/myProducts", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const products = await productsCollection.find(query).toArray();
  res.send(products);
});

////////////////  BOOKING PRODUCT MANAGE ////////////////
app.post("/booking", async (req, res) => {
  const bookingProduct = req.body;
  const result = await bookingsCollection.insertOne(bookingProduct);
  res.send(result);
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
