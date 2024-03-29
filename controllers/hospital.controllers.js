require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
            role:'hospital',
            district,
            status: 'Approved' // Set status to 'Approved' since admin is adding the hospital
        });
        await newHospital.save();

        // Send email with login credentials
        const message = `Hello ${hospitalName} hospital,\n\nYour login credentials are:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease use these credentials to log in.`;
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




const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the hospital by email
        const hospital = await Hospital.findOne({ email });

        // If hospital not found
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, hospital.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message:'Login successful 👌', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const listHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({ hospitals });
    } catch (error) {
        console.error('Error listing hospitals:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const updateHospitalProfile = async (req, res) => {
    try {
      const hospitalId = req.params.hospitalId;
      const { email, password } = req.body;
      
      // Check if the hospital exists
      const hospital = await Hospital.findById(hospitalId);
      if (!hospital) {
        return res.status(404).json({ error: 'Hospital not found' });
      }
  
      // Update hospital properties
      if (email) hospital.email = email;
      if (password) hospital.password = password;
  
      // Save the updated hospital
      await hospital.save();
      
      res.status(200).json({ message: 'Hospital profile updated successfully' });
    } catch (error) {
      console.error('Error updating hospital profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  
  const updateHospitalInfo = async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;
        const { hospitalName, hospitalCode, city, province, district, email } = req.body;
        
        // Check if the hospital ID is valid
        // if (!hospitalId) {
        //     return res.status(400).json({ error: 'Hospital ID is required' });
        // }

        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        console.log(hospital);
        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        // Update hospital information
        if (hospitalName) hospital.hospitalName = hospitalName;
        if (hospitalCode) hospital.hospitalCode = hospitalCode;
        if (city) hospital.city = city;
        if (province) hospital.province = province;
        if (district) hospital.district = district;
        if (email) hospital.email = email;

        // Save the updated hospital information
        await hospital.save();

        res.status(200).json({ success: true, message: 'Hospital information updated successfully', hospital });
    } catch (error) {
        console.error('Error updating hospital information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteHospital = async (req, res) => {
    try {
        const hospitalId = req.params.hospitalId;

        // Check if the hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ error: 'Hospital not found' });
        }

        // Delete the hospital
        await Hospital.findByIdAndDelete(hospitalId);

        res.status(200).json({ success: true, message: 'Hospital deleted successfully' });
    } catch (error) {
        console.error('Error deleting hospital:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






module.exports = {
    addHospital, 
    getHospital,
    // login,
    listHospitals,
    updateHospitalProfile,
    updateHospitalInfo, 
    deleteHospital
};
   