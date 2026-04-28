import mongoose from 'mongoose';

const LoadSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A load must belong to a company/user'],
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  origin: {
    type: String,
    required: [true, 'Please provide an origin'],
    trim: true,
  },
  destination: {
    type: String,
    required: [true, 'Please provide a destination'],
    trim: true,
  },
  weight: {
    type: Number,
    required: [true, 'Please provide the weight in lbs or kg'],
  },
  loadType: {
    type: String,
    required: [true, 'Please provide load type (e.g., Flatbed, Dry Van)'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picked', 'in_transit', 'delivered'],
    default: 'pending',
  },
  pickupDate: {
    type: Date,
    required: [true, 'Please provide a proposed pickup date'],
  },
  deliveryDate: {
    type: Date,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Load || mongoose.model('Load', LoadSchema);
