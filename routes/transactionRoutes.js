const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');


// Get list of transactions for a wallet
router.get('/:walletId', async (req, res) => {
  try {
    const transactions = await Transaction.find({ walletId: req.params.walletId });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add more transaction-related routes as needed


module.exports = router;
