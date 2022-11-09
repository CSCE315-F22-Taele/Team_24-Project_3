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

router.get('/managerlogin', (req, res) => {
    res.render('managerlogin');
});

router.post('/managerlogin', (req, res) => {
    let{username, password} = req.body;
    let error = "";

    if (username == "pandaboss" && password == "567") {
        res.redirect('/managers/managers');
    }
    else {
        error = "Username and password do not match";
        console.log(error);
        res.render('managerlogin', {error, username, password});
    }
});

module.exports = router;