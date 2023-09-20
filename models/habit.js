import mongoose from 'mongoose';
import {status} from '../enum/status.enum.js'

const habitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  favorite:{
    type: Boolean,
    require:true,
    default:false
  },
  habitDetails:[
    {
      date:{
        type:Date,
        require:true
      },
      status:{
        type: Number,
        enum: Object.values(status), 
        default: status.None,
      }
    }
  ]
}, { timestamps: true });

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
