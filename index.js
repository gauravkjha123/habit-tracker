import  config  from './config/config.js';
import db from './config/db.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import joi from 'joi'
console.log(joi.assert(4, joi.number()));

const app = express();

// Define the port,
let port =process.env.SERVER_PORT;

// Enable CORS middleware to allow cross-origin requests
app.use(cors());

// Enable body parsing middleware for JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 50 }));
app.use(bodyParser.json());

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
