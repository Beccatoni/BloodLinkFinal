const Admin = require('../models/admin.models');
const Hospital = require('../models/hospital.models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')





const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Check if the user is an admin
        let user = await Admin.findOne({ email });
        if (!user) {
            // If user is not an admin, check if it's a hospital user
            user = await Hospital.findOne({ email });
        }

        // If user not found in either collection
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message:'Login successful 👌', token });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = login;
