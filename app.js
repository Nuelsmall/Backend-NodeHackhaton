const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const walletRoutes = require('./routes/walletRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const MONGODB_URI = 'mongodb+srv://nueljohn90:0803888166@cluster0.lrxqbi9.mongodb.net/?retryWrites=true&w=majority';
const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://test:testing123@cluster0.lrxqbi9.mongodb.net/MyWalletDB?retryWrites=true&w=majority';

// Middleware
app.use(bodyParser.json());
app.use(express.json())

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
    startServer();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

// Start the server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

// Use the routes

app.use('/users', userRoutes);
// app.use('/');
app.use('/wallets', walletRoutes);
app.use('/transactions', transactionRoutes);

connectDB();
