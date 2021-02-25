// DELETE ALL DB
const { MongoClient } = require("mongodb");
const config = require("config");
const db = process.env.MONGODB_URI || config.get("mongoDb.URI");

const dbOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};
const client = new MongoClient(db, dbOptions);

const dbCleaning = async () => {
  try {
    await client.connect();
    const database = client.db("test");
    const collection = database.collection("locations");

    const query = {};
    const result = await collection.deleteMany(query);
    console.log("Deleted " + result.deletedCount + " documents");
    return result;
  } finally {
    // await client.close();
  }
};

module.exports = dbCleaning;
