const express = require('express');
const router = express.Router();
const Wallet = require('../models/wallet');

// Create a new wallet
router.post('/createWallet', async (req, res) => {
  const { userId, balance } = req.body;

  const wallet = new Wallet({ userId, balance });

  try {
    const newWallet = await wallet.save();
    res.status(201).json(newWallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update wallet balance
router.patch('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);

    if (req.body.balance) {
      wallet.balance = req.body.balance;
    }

    const updatedWallet = await wallet.save();
    res.json(updatedWallet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get wallet details
router.get('/:id', async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id);
    res.json(wallet);
  } catch (error) {
    res.status(404).json({ message: 'Wallet not found' });
  }
});

// Transfer funds to another wallet
router.post('/transfer', async (req, res) => {
  const { senderWalletId, receiverWalletId, amount } = req.body;

  try {
    const senderWallet = await Wallet.findById(senderWalletId);
    const receiverWallet = await Wallet.findById(receiverWalletId);

    if (!senderWallet || !receiverWallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    senderWallet.balance -= amount;
    receiverWallet.balance += amount;

    await senderWallet.save();
    await receiverWallet.save();

    res.json({ message: 'Funds transferred successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
