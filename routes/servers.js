const express = require('express')
const router = express.Router();

router.get('/servers', (req, res) => {
    res.render('servers');
});
module.exports = router;