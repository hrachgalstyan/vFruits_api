const { Server } = require('http');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
const Worker = require('./worker/index');
const helpers = require('./helpers');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD );

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succesful!'));

const port = process.env.PORT || 3000;

const server = Server(app);
server.listen(port);
console.log(`App running on port ${port}...`);

// Worker();

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});