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
//obtener productos de la expendedora
app.get("/productos", async (req, res) => {
  try {
    const productos = await db.collection("expendedora").findOne({});
    res.json(productos.productos);
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});
//obtener usuario de la base de datos
app.get("/usuario", async (req, res) => {
  try {
    const usuario = await db.collection("usuario").findOne({});
    res.json(usuario);
  } catch (err) {
    console.error("Error obteniendo usuario:", err);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
});
//obtener productos del usuario
app.get("/usuario/productos", async (req, res) => {
  try {
    const usuario = await db.collection("usuario").findOne({});
    res.json(usuario.inventario);
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).json({ error: "Error obteniendo productos" });
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
app.get("/maquina/monedas", async (req, res) => {
  try {
    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }
    res.json(maquina.monedas || []);
  } catch (err) {
    console.error("Error obteniendo monedas:", err);
    res.status(500).json({ error: "Error obteniendo monedas" });
  }
});

app.get("/maquina/billetes", async (req, res) => {
  try {
    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }
    res.json(maquina.billetes || []);
  } catch (err) {
    console.error("Error obteniendo billetes:", err);
    res.status(500).json({ error: "Error obteniendo billetes" });
  }
});

app.get("/maquina/productos", async (req, res) => {
  try {
    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }
    res.json(maquina.productos || []);
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).json({ error: "Error obteniendo productos" });
  }
});

app.post("/maquina/productos/actualizar", async (req, res) => {
  try {
    const { codigo, cantidad } = req.body;
    
    if (!codigo || typeof cantidad !== "number") {
      return res.status(400).json({ error: "codigo y cantidad son requeridos" });
    }

    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }

    const productos = maquina.productos || [];
    const productoIndex = productos.findIndex(p => p.codigo === codigo);
    
    if (productoIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    productos[productoIndex].cantidad += cantidad;
    
    if (productos[productoIndex].cantidad < 0) {
      productos[productoIndex].cantidad = 0;
    }

    await db.collection("expendedora").updateOne(
      {},
      { $set: { productos: productos } }
    );

    res.json({ ok: true, producto: productos[productoIndex] });
  } catch (err) {
    console.error("Error actualizando producto:", err);
    res.status(500).json({ error: "Error actualizando producto" });
  }
});

app.post("/maquina/monedas/actualizar", async (req, res) => {
  try {
    const { valor, cantidad } = req.body;
    
    if (typeof valor !== "number" || typeof cantidad !== "number") {
      return res.status(400).json({ error: "valor y cantidad son requeridos" });
    }

    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }

    const monedas = maquina.monedas || [];
    const monedaIndex = monedas.findIndex(m => m.valor === valor);
    
    if (monedaIndex === -1) {
      return res.status(404).json({ error: "Moneda no encontrada" });
    }

    monedas[monedaIndex].cantidad += cantidad;
    
    if (monedas[monedaIndex].cantidad < 0) {
      monedas[monedaIndex].cantidad = 0;
    }

    await db.collection("expendedora").updateOne(
      {},
      { $set: { monedas: monedas } }
    );

    res.json({ ok: true, moneda: monedas[monedaIndex] });
  } catch (err) {
    console.error("Error actualizando moneda:", err);
    res.status(500).json({ error: "Error actualizando moneda" });
  }
});

app.post("/maquina/billetes/actualizar", async (req, res) => {
  try {
    const { valor, cantidad } = req.body;
    
    if (typeof valor !== "number" || typeof cantidad !== "number") {
      return res.status(400).json({ error: "valor y cantidad son requeridos" });
    }

    const maquina = await db.collection("expendedora").findOne({});
    if (!maquina) {
      return res.status(404).json({ error: "No se encontró la máquina" });
    }

    const billetes = maquina.billetes || [];
    const billeteIndex = billetes.findIndex(b => b.valor === valor);
    
    if (billeteIndex === -1) {
      return res.status(404).json({ error: "Billete no encontrado" });
    }

    billetes[billeteIndex].cantidad += cantidad;
    
    if (billetes[billeteIndex].cantidad < 0) {
      billetes[billeteIndex].cantidad = 0;
    }

    await db.collection("expendedora").updateOne(
      {},
      { $set: { billetes: billetes } }
    );

    res.json({ ok: true, billete: billetes[billeteIndex] });
  } catch (err) {
    console.error("Error actualizando billete:", err);
    res.status(500).json({ error: "Error actualizando billete" });
  }
});
