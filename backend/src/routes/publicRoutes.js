const express = require('express');
const router = express.Router();
const { getProviderServices, getProviderServicesBySlug, submitRequest } = require('../controllers/publicController');

router.get('/services/:slug', getProviderServicesBySlug);
router.get('/:providerId', getProviderServices);
router.post('/request', submitRequest);

module.exports = router;
