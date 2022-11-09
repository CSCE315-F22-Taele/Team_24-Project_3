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

router.get('/serverlogin', (req, res) => {
    res.render('serverlogin');
});

router.post('/serverlogin', (req, res) => {
    let{username, password} = req.body;
    let errors = [];

    if (username == "pandagod" && password == "123") {
        res.redirect('/servers/servers');
    }
    else {
        errors.push( {message: "Username and password do not match"});
        console.log(errors);
        res.render('serverlogin', {errors, username, password});
    }
});

module.exports = router;