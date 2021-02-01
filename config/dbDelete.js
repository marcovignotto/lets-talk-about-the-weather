// DELETE ALL DB
const { MongoClient } = require("mongodb");
const config = require("config");
const db = config.get("mongoURI");

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
    return result;
    console.log("Deleted " + result.deletedCount + " documents");
  } finally {
    // await client.close();
  }
};

module.exports = dbCleaning;
