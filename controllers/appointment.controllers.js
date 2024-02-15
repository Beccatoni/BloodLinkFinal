const AppointmentModel = require('../models/appointment.models');
const sendEmail = require('../middlewares/email')


const createAppointment = async (req, res, next) => {
    const { fullName, mobileNumber, nationalID, email, province, bloodGroup, age, district,  gender, donationAvailability } = req.body;

    try {
        const newAppointment = new AppointmentModel({
            fullName,
            mobileNumber,
            nationalID,
            email,
            province,
            district,
            bloodGroup,
            age,
            gender,
            donationAvailability
        });

        const savedAppointment = await newAppointment.save();
        res.status(201).json({ success: true, message: 'Appointment created successfully', data: savedAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Controller to list all appointments
const listAppointments = async (req, res, next) => {
    try {
        const appointments = await AppointmentModel.find({});
        res.status(200).json({ success: true, data: appointments });
    } catch (error) {
        console.error('Error listing appointments:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Controller to get a single appointment by ID
const getAppointmentById = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;

    try {
        const appointment = await AppointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        console.error('Error getting appointment by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const confirmAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId;

    try {
        // Find the appointment by ID
        const appointment = await AppointmentModel.findByIdAndUpdate(
            appointmentId,
            { status: 'confirmed' },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.status(200).json({ success: true, message: 'Appointment confirmed', data: appointment });
    } catch (error) {
        console.error('Error confirming appointment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Controller to reject an appointment
const rejectAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { rejectionReason } = req.body;

    try {
        const appointment = await AppointmentModel.findByIdAndUpdate(appointmentId, { status: 'rejected', rejectionReason }, { new: true });
        if (!appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Optionally, send an email notification to the user about the rejection
        await sendEmail(appointment.email, 'Appointment Rejection', `Your appointment has been rejected. Reason: ${rejectionReason}`);

        res.status(200).json({ success: true, message: 'Appointment rejected successfully', appointment });
    } catch (error) {
        console.error('Error rejecting appointment:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};




module.exports = {
    createAppointment,
    listAppointments,
    getAppointmentById,
    confirmAppointment,
    rejectAppointment 
};
