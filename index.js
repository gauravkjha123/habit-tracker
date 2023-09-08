import  config  from './config/config.js';
import db from './config/db.js';
import express from 'express';
import logger from "./utils/customLogger.js";
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import flash from 'connect-flash';
import flashMiddleware from './middlwere/flash.js'
import routes from './routes/index.js'
import { HttpError } from 'routing-controllers';

const app = express();

// Define the port,
let port =process.env.SERVER_PORT;

// Enable CORS middleware to allow cross-origin requests
app.use(cors());

// Enable body parsing middleware for JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

app.use(session({  
  name: process.env.SESSION_NAME,
  secret:  process.env.SESSION_SECRET  ,  
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: Number(process.env.SESSION_EXPIRE_TIME )
  } 
}));

//---------Connect Flash----------//
app.use(flash());
app.use(flashMiddleware)

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//---------Web API----------//
app.use('/',routes);


//Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
      logger.error(err);
      return res.status(500).send(err.message);
    }
    console.error(err.stack);
   return res.status(500).json({ error: 'Internal Server Error' });
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
