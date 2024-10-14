import mongoose from 'mongoose';

const FundSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a fund name'],
    enum: ['Family Fund', 'Child Allowance'],
  },
  balance: {
    type: Number,
    required: [true, 'Please provide a balance'],
    min: 0,
  },
});

export default mongoose.models.Fund || mongoose.model('Fund', FundSchema);