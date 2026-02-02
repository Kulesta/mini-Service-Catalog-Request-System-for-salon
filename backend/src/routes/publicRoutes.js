const express = require('express');
const router = express.Router();
const { getProviderServices, submitRequest } = require('../controllers/publicController');

router.get('/:providerId', getProviderServices);
router.post('/request', submitRequest);

module.exports = router;
