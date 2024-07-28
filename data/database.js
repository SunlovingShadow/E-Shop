const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/E-shop';
    const client = await MongoClient.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    database = client.db();
}

function getDb() {
    if (!database) {
        throw new Error('You must connect to the database first!');
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
};
