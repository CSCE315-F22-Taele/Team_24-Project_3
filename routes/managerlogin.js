/** Express router providing user related routes
 * @module routes/managerlogin
 * @requires express, body-parser, pg
 */

const express = require('express');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
const router = express.Router();

const { Pool } = require('pg');
const dotenv = require('dotenv').config();
// Create express app
const port = 3000;

process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
/**
 * Route serving manager login form.
 * @name get/managerlogin
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.get('/managerlogin', (req, res) => {
    res.render('managerlogin');
});

/**
 * Route validating manager login form. On successful verification, user gets redericted to the manager's view
 * @name post/managerlogin
 * @function
 * @param {string, string} credentials - user provides user credentials to be verified
 */
router.post('/managerlogin', (req, res) => {
    let{username, password} = req.body;
    let errors = [];

    if (username == "pandaboss" && password == "567") {
        res.redirect('/managers/managers');
    }
    else {
        errors.push( {message: "Username and password do not match"});
        console.log(errors);
        res.render('managerlogin', {errors, username, password});
    }
});

module.exports = router;