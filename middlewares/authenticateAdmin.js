require('dotenv').config();

const Admin = require('../models/admin.models');
const jwt = require('jsonwebtoken');


const authenticateAdmin = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        console.log(authToken);

        if (!authToken) {
            return res.status(401).json({ error: 'Authorization token is missing' });
        }

        try {
            const token = authToken.split(' ')[1];
            const decoded = jwt.verify(token, process.env.jWT_SECRET_KEY);

            console.log(decoded);

            const admin = await Admin.findById(decoded._id);
            
            if (admin.email === 'rbccmtni1@gmail.com') {
                req.admin = decoded._id;
                next();
            } else {
                return res.status(401).json({ error: 'Invalid admin token' });
            }
        } catch (error) {
            console.error('JWT Verification Error:', error);
            return res.status(401).json({ error: 'Invalid authorization token' });
        }
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = authenticateAdmin
