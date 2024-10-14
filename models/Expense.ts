import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: [true, 'Please provide a date for the expense'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category for the expense'],
  },
  details: {
    type: String,
    required: [true, 'Please provide details for the expense'],
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount for the expense'],
    min: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a user for the expense'],
  },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);