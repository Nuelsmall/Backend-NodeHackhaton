const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
  },
  amount: Number,
  // Other transaction properties
});

module.exports = mongoose.model('Transaction', transactionSchema);
