const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const mongoUrl = process.env.MONGODB_URI;
    try {
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        database = client.db();
        console.log('Connected to the database successfully');
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1);
    }
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