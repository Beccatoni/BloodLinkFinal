require("dotenv").config();
const Admin = require("../models/admin.models");
const Hospital = require("../models/hospital.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generalLogin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    var admin = {};
    var hospital = {};

    if (role === "admin") {
      admin = await Admin.findOne({ email: email });
    } else {
      hospital = await Hospital.findOne({ email: email });
    }

    if (!admin || !hospital) {
      return res.status(404).json({ error: "User not found" });
    } else {
      var isPasswordValid = undefined;
      if (admin.role) {
        isPasswordValid = admin.password === password;
      } else if (hospital.role) {
        isPasswordValid = await bcrypt.compare(password, hospital.password);
      }

      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" });
      } else {
        const adminToken = jwt.sign(
          { _id: admin._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );
        const hospitalToken = jwt.sign(
          { _id: hospital._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "24h",
          }
        );

        if (admin && admin.role === "admin") {
          res.json({
            message: "Admin login successful",
            user: admin,
            role: "admin",
            adminToken,
          });
        } else if (hospital && hospital.role === "hospital") {
          res.json({
            message: "Hospital login successful",
            user: admin,
            role: "hospital",
            hospitalToken,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// exports.adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const admin = await Admin.findOne({ email: email });

//     if (!admin) {
//       return res.status(404).json({ error: "Admin not found" });
//     } else {
//       // Compare plain text password directly
//       if (password !== admin.password) {
//         return res.status(401).json({ error: "Invalid password" });
//       } else {
//         const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET_KEY, {
//           expiresIn: "24h",
//         });
//         res.json({ message: "Admin login successful", admin, token });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

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

module.exports = {
  generalLogin,
  getAllAdmins,
  getAdminProfile,
};
