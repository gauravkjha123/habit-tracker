import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import db from './config/db.js';
import cors from 'cors';


const app = express();

// Define the port, use the development port if available, otherwise use 3000
const port =
  process.env.NODE_ENV === 'development'
    ? process.env.HABIT_TRACKER_DEV_PORT
    : process.env.HABIT_TRACKER_PROD_PORT || 3000;


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
