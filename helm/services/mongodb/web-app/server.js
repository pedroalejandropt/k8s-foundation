const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const app = express();

const uri = "mongodb://mongodb-mongodb.default.svc.cluster.local:27017";
const client = new MongoClient(uri);

let db;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión inicial a MongoDB
async function connectDB() {
  await client.connect();
  db = client.db("test");
}
connectDB();

// Página principal con search
app.get("/", async (req, res) => {
  const search = req.query.search || "";
  const items = await db
    .collection("test")
    .find({ name: { $regex: search, $options: "i" } })
    .toArray();
  res.render("index", { items, search });
});

// ➕ Agregar nuevo item
app.post("/add", async (req, res) => {
  const name = req.body.name;
  await db.collection("test").insertOne({ name });
  res.redirect("/");
});

// ✏️ Actualizar item
app.post("/update/:id", async (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  await db.collection("test").updateOne({ _id: new ObjectId(id) }, { $set: { name } });
  res.redirect("/");
});

// 🗑️ Eliminar item
app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.collection("test").deleteOne({ _id: new ObjectId(id) });
  res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Listening on port ${port}`));