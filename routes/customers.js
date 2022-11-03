const express = require('express')
const router = express.Router();

router.get('/customers', (req, res) => {
    res.render('customers');
});
module.exports = router;