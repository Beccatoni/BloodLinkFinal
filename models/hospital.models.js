const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const hospitalSchema = new mongoose.Schema({
    hospitalName: { type: String, required: true },

    hospitalCode: { type: String, required: true, unique: true },

    email: { type: String, required: true, unique: true },
     
    password: { type: String, required: true },
    city: { type: String, required: true}, 

    province: { type: String, required: true},

    district: {type: String, required: true},
    role:{ type: String, required: true, enum: ['admin', 'hospital']},
     
    status: { type: String, default: 'Approved' }
});
// hospitalSchema.pre('save', async function (next) {
//     const hospital = this;
//     if (hospital.isModified('password')) {
//         const saltRounds = 10;
//         hospital.password = await bcrypt.hash(hospital.password, saltRounds);
//     }
//     next();
// });

module.exports = mongoose.model('Hospital', hospitalSchema);