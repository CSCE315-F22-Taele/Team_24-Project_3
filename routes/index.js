/** Express router providing user related routes
 * @module routes/index
 * @requires express
 */

const express = require('express')
const router = express.Router();


/**
 * Route the landing page of Panda Express solution
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/', (req, res) => {
    res.render('landing');
});
module.exports = router;