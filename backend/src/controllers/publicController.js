const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Request = require('../models/Request');

exports.getProviderServices = async (req, res) => {
    try {
        const { providerId } = req.params;
        const provider = await User.findById(providerId).select('full_name company_name email phone slug');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        const categories = await Category.find({ provider: providerId, status: 'active' });
        const services = await Service.find({ provider: providerId });
        const catalog = categories.map(cat => {
            const catServices = services.filter(s => s.category.toString() === cat._id.toString());
            return { ...cat.toObject(), services: catServices };
        });
        res.json({ provider, catalog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getProviderServicesBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const provider = await User.findOne({ slug }).select('full_name company_name email phone slug');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        const categories = await Category.find({ provider: provider._id, status: 'active' });
        const services = await Service.find({ provider: provider._id });
        const catalog = categories.map(cat => {
            const catServices = services.filter(s => s.category.toString() === cat._id.toString());
            return { ...cat.toObject(), services: catServices };
        });
        res.json({ provider, catalog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.submitRequest = async (req, res) => {
    try {
        const { providerId, serviceIds, customerName, customerPhone, customerNote } = req.body;
        const newRequest = await Request.create({
            provider: providerId,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_note: customerNote,
            services: serviceIds
        });
        res.json({ message: 'Request submitted successfully!', requestId: newRequest._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};