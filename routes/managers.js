const express = require('express')
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
// Create express app
const port = 3000;
// Create pool
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: {rejectUnauthorized: false}
});
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});

router.get('/managers', (req, res) => {
    res.render('managers');
});
router.get('/inventory', (req, res) => {
    inventory = []
    pool
        .query('SELECT * FROM inventory order by id;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                inventory.push(query_res.rows[i]);
            }
            const data = {inventory: inventory};
            console.log(inventory);
            res.render('inventory', data);
        });
});
module.exports = router;