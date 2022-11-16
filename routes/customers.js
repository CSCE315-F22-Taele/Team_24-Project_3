const express = require('express');
const router = express.Router();

router.get('/customers', (req, res) => {
    res.render('customers');
});

router.get('/locations', (req, res) => {
    res.render('locations');
});

module.exports = router;