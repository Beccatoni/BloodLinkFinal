const Request = require('../models/bloodReq.models');

const createRequest = async (req, res) => {
  try {
    const { hospitalId, bloodType, quantity, urgency, contactInfo } = req.body;
    const newRequest = new Request({ hospitalId, bloodType, quantity, urgency, contactInfo });
    await newRequest.save();
    res.status(201).json({ success: true, message: 'Blood request submitted successfully' });
  } catch (error) {
    console.error('Error submitting blood request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('hospitalId');
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Other controller functions for updating and deleting requests
const updateRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { bloodType, quantity, urgency, contactInfo } = req.body;
    
    const updatedRequest = await Request.findByIdAndUpdate(requestId, 
      { bloodType, quantity, urgency, contactInfo }, 
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Request updated successfully', data: updatedRequest });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    
    if (!deletedRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest
};
