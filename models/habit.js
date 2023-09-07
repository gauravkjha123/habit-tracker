import mongoose from 'mongoose';

const habitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
