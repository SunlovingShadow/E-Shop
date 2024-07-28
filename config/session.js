const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    databaseName: 'eshop',
    collection: 'sessions',
    ssl: true,
    sslValidate: false,
    tlsAllowInvalidCertificates: true
  });

  // Handle connection errors
  store.on('error', function(error) {
    console.error('Session store error:', error);
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET || 'super-secret',
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    },
    proxy: true // trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
  };
}

module.exports = createSessionConfig;