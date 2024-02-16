require("dotenv").config();
const Admin = require("../models/admin.models");
const Hospital = require("../models/hospital.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (!password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ adminId: admin._id}, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });
    res.status(200).json({ message: 'Admin login successful', token,role:admin.role  });
  } catch (error) {
    console.error('Error in admin login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    console.error("Error in getAllAdmins:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAdminProfile = async (req, res, next) => {
  const adminId = req.params.adminId;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    console.error("Error in getAdminProfile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const AdminSignUp = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the email is already registered
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new Admin({
      email,
      password,
      role
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: 'User registration successful' });
  } catch (error) {
    console.error('Error in user sign-up:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  AdminSignUp,
  generalLogin,
  getAllAdmins,
  getAdminProfile,
};
