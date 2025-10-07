const { MongoClient } = require('mongodb');

const mongoConfig = {
  user: "bieelsiilvax",
  password: "Biel123",
  comment: "Credenciais de acesso ao MongoDB"
};

const MONGO_URI = `mongodb+srv://${mongoConfig.user}:${mongoConfig.password}@cluster0.mybeluq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let cachedClient = null;
let cachedDb = null;
let collections = null;

async function connectToDatabase() {
  if (cachedDb && collections) return { db: cachedDb, collections };

  const client = new MongoClient(MONGO_URI);

  await client.connect();
  const db = client.db('SashaBot#2025');

  collections = {
    gruposConfigs: db.collection('gruposConfigs'),
    rankMessages: db.collection('rankMessages'),
    usuarios: db.collection('usuarios')
  };

  cachedClient = client;
  cachedDb = db;

  return { db, collections };
}

module.exports = connectToDatabase;