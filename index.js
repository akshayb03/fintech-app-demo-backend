import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from './src/models/Account.js';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Get all accounts
app.get('/accounts', async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a particular account by Name
app.get('/accounts/:name', async (req, res) => {
  try {
    const account = await Account.findOne({ name: req.params.name });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new account
app.post('/accounts', async (req, res) => {
  try {
    const {
      name,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      balance,
      isActive,
      limit
    } = req.body;

    if (!name || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newAccount = new Account({
      name,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      balance,
      isActive: isActive ?? true,
      limit: limit ?? 0
    });

    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change the freeze status for a debit card
app.patch('/accounts/:name/active', async (req, res) => {
  try {
    const { isActive } = req.body;

    const account = await Account.findOne({ name: req.params.name });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    account.isActive = isActive;
    await account.save();

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});