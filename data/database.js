const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let database;

async function connectToDatabase() {
    const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/E-shop';
    try {
        const client = await MongoClient.connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        database = client.db();
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error; // Re-throw the error for handling in app.js
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