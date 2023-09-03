import mongoose from 'mongoose';

// MongoDB connection URL
const dbUrl = process.env.MONGO_URL;

// Create a function to connect to the database
const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Adds support for unique indexes
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the application on database connection error
  }
};

connectToDatabase();

// Export the database connection instance
export default mongoose.connection;
