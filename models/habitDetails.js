import mongoose from 'mongoose';

const status = {
  Done: 0,
  NotDone: 1,
  None: 2,
};

const habitDetailsSchema = new mongoose.Schema({
  habit: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Habit',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
  },
  status: {
    type: Number,
    enum: Object.values(status), 
    default: status.None,
  },
}, {
  timestamps: true,
});

const HabitDetails = mongoose.model('HabitDetails', habitDetailsSchema);

export default HabitDetails;
