const express = require('express');
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

//SERVER BUTTON
router.get('/servers', (req, res) => {
    res.render('servers');
});


//ORDER BUTTONS 
router.get('/order/bowl', (req, res) => {
    res.render('bowl');
});

router.get('/order/drinks', (req, res) => {
    res.render('drinks');
});

router.get('/order/entrees', (req, res) => {
    res.render('entrees');
});

router.get('/order/sides', (req, res) => {
    res.render('sides');
});

router.get('/order/biggerplate', (req, res) => {
    res.render('biggerplate');
});

router.get('/order/plate', (req, res) => {
    res.render('biggerplate');
});





router.get('/order', async (req, res) => {
    orderarr = []
    pool
        .query("SELECT item,price FROM inventory WHERE (id BETWEEN 0 AND 23) OR (id BETWEEN 27 AND 32) AND item!='napkins' OR id>38 ORDER BY id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                orderarr.push(query_res.rows[i]);
            }
            const data = {orderarr: orderarr};
            res.render('order', data);
            
            for(let i=1;i<= orderarr.length;i++){
                router.post('/order/'+i, (req, res) => {
                            pool.query("INSERT INTO currentorders VALUES ($1,$2)",[orderarr[i].item, orderarr[i].price], (err, result) => {
                                if (err) throw err;
                                console.log(i);
                            })
                            
                            })
                        }
        });
    });
   

    
    

router.get('/restockreport', (req, res) => {
    restockreport = []
    pool
        .query("SELECT id,item,category,quantity FROM inventory WHERE quantity<50 ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                restockreport.push(query_res.rows[i]);
            }
            const data = {restockreport: restockreport};
            console.log(restockreport);
            res.render('restockreport', data);
        });
});
router.get('/itemsales' , (req, res) => {
    itemsales = []
    pool
        .query('SELECT * FROM itemizedhistory;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                itemsales.push(query_res.rows[i]);
            }
            const data = {itemsales: itemsales};
            console.log(itemsales);
            res.render('itemsales', data);
        });
});

router.get('/orderslist' , (req, res) => {
    orderslist = []
    pool
        .query('SELECT * FROM currentorders;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                orderslist.push(query_res.rows[i]);
            }
            const data = {orderslist: orderslist};
            console.log(orderslist);
            res.render('orderslist', data);
        });
});
module.exports = router;
