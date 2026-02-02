const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new provider
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { full_name, email, phone, password, company_name, license_number } = req.body;

        // Validation
        if (!full_name || !email || !phone || !password || !company_name || !license_number) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check availability
        const userExists = await User.findOne({
            $or: [{ email }, { license_number }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email or license already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            full_name,
            email,
            phone,
            password: hashedPassword,
            company_name,
            license_number
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                full_name: user.full_name,
                email: user.email,
                company_name: user.company_name,
                token: generateToken(user.id),
                message: "Registration successful"
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                full_name: user.full_name,
                email: user.email,
                company_name: user.company_name,
                token: generateToken(user.id)
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
