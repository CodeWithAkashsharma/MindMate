// Load environment variables FIRST
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

// Connect to the MongoDB database
connectDB();

// Determine the port
const PORT = process.env.PORT || 5000;

// Turn on the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});