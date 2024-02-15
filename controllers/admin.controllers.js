require("dotenv").config();
const Admin = require('../models/admin.models');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');



const adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email: email });
  
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      } else {
        if (password !== admin.password) {
          return res.status(401).json({ error: "Invalid password" });
        } else {
          const token = jwt.sign({ _id: admin._id }, process.env.jWT_SECRET_KEY, {
            expiresIn: "24h",
          });
          res.json({ message: "Admin login successful", admin, token });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };

  const getAdminProfile = async (req, res, next) => {
    const adminId = req.params.adminId;
    
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.status(200).json({ success: true, data: admin });
    } catch (error) {
        console.error('Error in getAdminProfile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

  module.exports = {
    adminLogin,
    getAdminProfile

  }