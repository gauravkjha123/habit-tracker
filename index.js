import  config  from './config/config.js';
import db from './config/db.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Define the port,
let port =process.env.SERVER_PORT;

// Enable CORS middleware to allow cross-origin requests
app.use(cors());

// Enable body parsing middleware for JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true, limit: 50 }));
app.use(bodyParser.json());

app.use(session({  
  name: process.env.SESSION_NAME,
  secret:  process.env.SESSION_SECRET  ,  
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: process.env.SESSION_EXPIRE_TIME 
  } 
}));

//Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
