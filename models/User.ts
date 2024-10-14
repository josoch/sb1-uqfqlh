import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
  },
  role: {
    type: String,
    enum: ['Father', 'Mother', 'Child'],
    required: [true, 'Please specify the user role'],
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);