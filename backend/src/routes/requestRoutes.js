const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { protect } = require('../middleware/authMiddleware');

// Get all requests for logged in provider
router.get('/', protect, async (req, res) => {
    try {
        console.log("Fetching requests for Provider:", req.user._id); // DEBUG
        const requests = await Request.find({ provider: req.user._id })
            .populate('services')
            .sort({ createdAt: -1 }); // Newest first
        console.log("Found requests:", requests.length); // DEBUG
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update status
router.put('/:id', protect, async (req, res) => {
    try {
        const request = await Request.findOne({ _id: req.params.id, provider: req.user._id });
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = req.body.status;
        await request.save();

        res.json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
