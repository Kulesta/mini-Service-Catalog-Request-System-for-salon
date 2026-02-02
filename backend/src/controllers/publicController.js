const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Request = require('../models/Request');

// @desc    Get provider services for public page
// @route   GET /api/public/:providerId
// @access  Public
exports.getProviderServices = async (req, res) => {
    try {
        const { providerId } = req.params;

        // 1. Get Provider Details
        const provider = await User.findById(providerId).select('full_name company_name email phone');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }

        // 2. Get Categories
        const categories = await Category.find({ provider: providerId, status: 'active' });

        // 3. Get Services
        const services = await Service.find({ provider: providerId });

        // 4. Structure data (Group services by category)
        const catalog = categories.map(cat => {
            const catServices = services.filter(s => s.category.toString() === cat._id.toString());
            return {
                ...cat.toObject(),
                services: catServices
            };
        });

        res.json({
            provider,
            catalog
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Submit a service request
// @route   POST /api/public/request
// @access  Public
exports.submitRequest = async (req, res) => {
    try {
        const { providerId, serviceIds, customerName, customerPhone, customerNote } = req.body;

        console.log("Saving Request for Provider:", providerId); // DEBUG
        console.log("Data:", { customerName, customerPhone, serviceIds }); // DEBUG

        const newRequest = await Request.create({
            provider: providerId,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_note: customerNote,
            services: serviceIds
        });

        console.log("Request Saved with ID:", newRequest._id); // DEBUG

        res.json({ message: 'Request submitted successfully!', requestId: newRequest._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
