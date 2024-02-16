const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodTypesRequired: { type: String, required: true },
  quantity: { type: String, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  location: { type: String, required: true},
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  date: {
    type: Date,
    default: Date.now, 
    required: true,
},
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('Request', RequestSchema);
