import mongoose from 'mongoose';
import logger from '../utils/customLogger.js'

// MongoDB connection URL
const dbUrl = process.env.MONGO_URL;

// Create a function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.log('Connected to the database');
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application on database connection error
  }
};

connectToDatabase();

// Export the database connection instance
export default mongoose.connection;
