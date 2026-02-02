require('dotenv').config();
const mongoose = require('mongoose');
const Request = require('../models/Request');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/salon_db')
    .then(async () => {
        console.log('Connected to DB');
        const validRequests = await Request.find({});
        console.log(`TOTAL REQUESTS FOUND: ${validRequests.length}`);

        if (validRequests.length > 0) {
            const lastReq = validRequests[validRequests.length - 1];
            console.log('LAST REQUEST DETAILS:');
            console.log(`- Request ID: ${lastReq._id}`);
            console.log(`- Provider ID: ${lastReq.provider}`);
            console.log(`- Customer: ${lastReq.customer_name}`);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
