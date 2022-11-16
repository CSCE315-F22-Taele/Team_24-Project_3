const express = require('express');
// const path = require('path');
const router = express.Router();
// const app = express();

router.get('/customers', (req, res) => {
    res.render('customers');
});

router.get('/locations', (req, res) => {
    res.render('locations');
  });

module.exports = router;