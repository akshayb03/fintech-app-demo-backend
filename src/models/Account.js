import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cardNumber: { type: String, required: true },
  cvv: {type: String, required: true},
  expiryMonth: { type: String, required: true },
  expiryYear: { type: String, required: true },
  balance: { type: Number, required: true },
  limit: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
});

export default mongoose.model('Account', AccountSchema);