import mongoose from '../database/database.js';

const roomSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  dimensions: { type: String, required: true },
  includes: [String],
  rentalPeriods: [Number],
  additionalFeatures: [String],
  availability: { type: Number, default: 1 }
});

const Room = mongoose.model('Room', roomSchema);

export default Room; 
