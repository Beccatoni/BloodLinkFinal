const bcrypt = require('bcrypt');
const Hospital = require('../models/hospital.models')
const sendEmail = require('../middlewares/email')




const addHospital = async (req, res) => {
    try {
        const { hospitalName, hospitalCode, email, city, province, district } = req.body;

        // Check if hospital with the given email already exists
        const existingHospital = await Hospital.findOne({ email });
        if (existingHospital) {
            return res.status(400).json({ message: 'Hospital with this email already exists' });
        }

        // Generate random password
        const password = Math.random().toString(36).slice(-8); // Temporary password - you may want to use a stronger password generator

        // Create a new hospital
        const hashedPassword = await bcrypt.hash(password, 10);
        const newHospital = new Hospital({
            hospitalName,
            hospitalCode,
            email,
            password: hashedPassword,
            city,
            province,
            district,
            status: 'Approved' // Set status to 'Approved' since admin is adding the hospital
        });
        await newHospital.save();

        // Send email with login credentials
        const message = `Hello ${hospitalName},\n\nYour login credentials are:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease use these credentials to log in.`;
        const subject = 'Welcome to BloodLink System';
        await sendEmail(email, message, subject);

        res.status(201).json({ message: 'Hospital added successfully. Login credentials sent to your email.' });
    } catch (error) {
        console.error('Error adding hospital:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// get hospital profile
const getHospital = async (req, res) => {
    const hospitalCode = req.params.hospitalCode;
    try {
        const hospital = await Hospital.findOne({ hospitalCode: hospitalCode });
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }
        res.status(200).json(hospital);
    } catch (error) {
        console.error('Error getting hospital:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





module.exports = {
    addHospital, 
    getHospital
};
   