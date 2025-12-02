require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
async function start() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Conectado a MongoDB Atlas");

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log("API escuchando en http://localhost:" + port);
    });
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
    process.exit(1);
  }
}

start();
app.get("/usuario", async (req, res) => {
  try {
    const usuario = await db.collection("usuario").findOne({});
    res.json(usuario);
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
});

app.post("/usuario/dinero", async (req, res) => {
  try {
    const { dinero } = req.body;
    if (typeof dinero !== "number") {
      return res.status(400).json({ error: "dinero debe ser número" });
    }
    const result = await db.collection("usuario").updateOne(
      {}, // solo hay uno
      { $set: { dinero } }
    );

    res.json({ ok: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error("Error actualizando dinero:", err);
    res.status(500).json({ error: "Error actualizando dinero" });
  }
});
