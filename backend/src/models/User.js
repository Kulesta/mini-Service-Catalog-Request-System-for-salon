const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    company_name: {
        type: String,
        required: true
    },
    license_number: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['provider'],
        default: 'provider'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
