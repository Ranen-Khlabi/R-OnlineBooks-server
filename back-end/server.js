// Require necessary NPM packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");



// Require Route Files
const studentRouter = require('./routes/student');
const contributorRouter = require('./routes/contributor');
const bookRouter = require('./routes/book');
// Require DB Configuration File
const db = require('./config/db');
// Establish Database Connection
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo');
});
// Instantiate Express Application Object
const app = express();
// app.use((req, res, next) => { res.header('Access-Control-Allow-Origin', '*'); next();});
// Define PORT for the API to run on
const port = process.env.PORT || 5000;
const reactPort = 3000;

/*** Middleware ***/

// Use envieronemnt variables from .env file
dotenv.config();
// Middleware
app.use(cookieParser());

// Add `bodyParser` middleware which will parse JSON requests
// into JS objects before they reach the route files.
//
// The method `.use` sets up middleware for the Express application
app.use(express.json());

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", `http://localhost:${reactPort}`); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
// Set CORS headers on response from this API using the `cors` NPM package.
app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:${reactPort}` }))



// Mount imported Routers
app.use(studentRouter);
app.use(contributorRouter);
app.use(bookRouter);


// Start the server to listen for requests on a given port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
}); 