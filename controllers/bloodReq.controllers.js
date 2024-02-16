const Request = require('../models/bloodReq.models');
const Appointment = require('../models/appointment.models');
const sendEmail = require('../middlewares/email');
const Hospital = require('../models/hospital.models'); // Assuming you have a Hospital model

// const createRequest = async (req, res) => {
//   try {
//     const { hospitalId, bloodType, quantity, urgency, location } = req.body;
    
//     // Create the blood request in the database
//     const newRequest = new Request({ hospitalId, bloodType, quantity, urgency, location });
//     await newRequest.save();

//     // Get recipient emails based on urgency
//     let recipientEmails = [];
//     if (urgency === 'urgent') {
//       // Get emails of all hospitals from the Hospital collection
//       const hospitals = await Hospital.find({}, 'email');
//       recipientEmails = hospitals.map(hospital => hospital.email);
//       const message1 = `Hello ${Hospital.fullName} we request for blood at ${Hospital.hospitalName}. Thank you for your participation`
//       await sendEmail(recipientEmails, message1, 'Blood Request');
//     } else {
//       // Get emails of all donors from the Appointments collection
//       const donors = await Appointment.find({ role: 'donor' }, 'email');
//       recipientEmails = donors.map(donor => donor.email);
//       const message = `Hello ${Appointment.fullName} we need you at ${Hospital.hospitalName} for blood donation. Thank you for your participation`
//       await sendEmail(recipientEmails, message, 'Blood Request');
//     }

//     // Send email notification to recipients
//     // await sendEmail(recipientEmails, 'Blood request notification', 'Blood Request');

//     res.status(201).json({ success: true, message: 'Blood request submitted successfully' });
//   } catch (error) {
//     console.error('Error submitting blood request:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


const createRequest = async (req, res, next) => {
  try {
    const { hospitalCode, bloodTypesRequired, quantity, urgency, location } = req.body;

    // Retrieving donors with matching specified blood types
    const matchingDonors = await Appointment.find({ bloodGroup: bloodTypesRequired });
    console.log(matchingDonors);
    for (const donor of matchingDonors) {
      const message = `Dear ${donor.fullName},\n\nThere is an urgent need for your blood type (${donor.bloodGroup}) at ${location}. Please respond if you are available for donation.\n\nBest Regards,\nBLOODLINK Team`;
      sendEmail(donor.email, 'Urgent Blood Donation Request', message);
    }

    const savedRequest = await Request.create(req.body);

    res.json({
      requestID: savedRequest._id,
      status: 'success',
      message: 'General blood request initiated. Donors with specified blood types alerted.',
    });
  } catch (error) {
    console.error('Error processing blood request:', error);
    res.status(500).json({ error: error.message, message: 'Internal server error' });
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
