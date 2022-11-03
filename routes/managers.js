const express = require('express')
const router = express.Router();

router.get('/managers', (req, res) => {
    res.render('managers');
});
module.exports = router;