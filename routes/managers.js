const express = require('express');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');
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

router.post('/inventory', (req, res) => {
    let{id,quantity} = req.body;
    console.log({id,quantity});
    pool
        .query('UPDATE inventory SET quantity = $1 WHERE id = $2;',[quantity, id], (err, result) => {
            if (err) throw err;
            console.log(result.rows);
        })
        res.redirect('/managers/inventory');
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

router.get('/saleshistory', (req, res) => {
    saleshistory = []
    pool
        .query('SELECT * FROM saleshistory order by date;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                saleshistory.push(query_res.rows[i]);
            }
            const data = {saleshistory: saleshistory};
            console.log(saleshistory);
            res.render('saleshistory', data);
        });
});

router.get('/employeelist' , (req, res) => {
    employeelist = []
    pool
        .query('SELECT * FROM employees;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                employeelist.push(query_res.rows[i]);
            }
            const data = {employeelist, employeelist};
            console.log(employeelist);
            res.render('employeelist', data);
        });
});

router.get('/menu' , (req, res) => {
    menu = []
    pool
        .query('SELECT id,item,price FROM inventory WHERE (id BETWEEN 0 AND 23) OR (id BETWEEN 27 AND 32) AND item!=\'napkins\' OR id>38 ORDER BY id;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                menu.push(query_res.rows[i]);
            }
            const data = {menu, menu};
            console.log(menu);
            res.render('menu', data);
        });
});

module.exports = router;