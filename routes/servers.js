const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
// router.use(express.static("public"));
const { Pool } = require('pg');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
// Create express router
const port = 3000;
var moment = require('moment');  
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
    console.log('routerlication successfully shutdown');
    process.exit(0);
});

//SERVER BUTTON
router.get('/servers', (req, res) => {
    res.render('servers');
});

//ORDER BUTTONS 
router.get('/order/bowl', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreearr.push(query_res.rows[i]);
            }
            const data = {entreearr: entreearr};
            res.render('bowl', data);
            console.log(entreearr.length);
            for(let i=0;i< entreearr.length;i++){
                router.post('/order/bowl/entree/'+i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});


router.get('/order/drinks', (req, res) => {
    res.render('drinks');
});

router.get('/order/entrees', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreearr.push(query_res.rows[i]);
            }
            const data = {entreearr: entreearr};
            res.render('entrees', data);
            console.log(entreearr.length);
            for(let i=0;i< entreearr.length;i++){
                router.post('/order/entrees/entree/'+i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,$2)",[entreearr[i].item,entreearr[i].price], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/order/sides', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreearr.push(query_res.rows[i]);
            }
            const data = {entreearr: entreearr};
            res.render('sides', data);
            console.log(entreearr.length);
            for(let i=0;i< entreearr.length;i++){
                router.post('/order/sides/entree/'+i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,$2)",[entreearr[i].item,entreearr[i].price], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/order/biggerplate', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreearr.push(query_res.rows[i]);
            }
            const data = {entreearr: entreearr};
            res.render('biggerplate', data);
            console.log(entreearr.length);
            for(let i=0;i< entreearr.length;i++){
                router.post('/order/biggerplate/entree/'+i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/order/plate', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++){
                entreearr.push(query_res.rows[i]);
            }
            const data = {entreearr: entreearr};
            res.render('plate', data);
            console.log(entreearr.length);
            for(let i=0;i< entreearr.length;i++){
                router.post('/order/plate/entree/'+i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/order',  (req, res) => {
    bowllist = []

    pool.query("SELECT price,item FROM inventory WHERE item = 'bowl' OR item = 'plate' OR item = 'biggerplate' Order by id ")
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                bowllist.push(query_res.rows[i]);
            }
            const data = {bowllist: bowllist};
            res.render('order',data)
        });
        
});
            //const data = {orderarr: orderarr};
            //res.render('order', data);
            
            //for(let i=1;i<= orderarr.length;i++){
                //router.post('/order/'+i, (req, res) => {
                    //pool.query("INSERT INTO currentorders VALUES ($1,$2)",[orderarr[i].item, orderarr[i].price], (err, result) => {
                        //if (err) throw err;
                       // console.log(i);
                   // })
                //})
            //}
        //});
//});
router.post('/order/bowl', (req, res) => {
    var bowl_price
    pool.query("SELECT price FROM inventory WHERE item = 'bowl'", (err, result) => {
            if (err) throw err;
            bowl_price = result.rows[0].price;
            pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Bowl: ", bowl_price], (err, result) => {
                if (err) throw err;
               // console.log(i);
           // })
        })
    })
    res.redirect('/servers/order/bowl')
});
router.post('/order/plate', (req, res) => {
    var plate_price
    pool.query("SELECT price FROM inventory WHERE item = 'plate'", (err, result) => {
            if (err) throw err;
            plate_price = result.rows[0].price;
            pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Plate: ", plate_price], (err, result) => {
                if (err) throw err;
               // console.log(i);
           // })
        })
    })
    res.redirect('/servers/order/plate')
});
router.post('/order/biggerplate', (req, res) => {
    var plate_price
    pool.query("SELECT price FROM inventory WHERE item = 'biggerplate'", (err, result) => {
            if (err) throw err;
            plate_price = result.rows[0].price;
            pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Biggerplate: ", plate_price], (err, result) => {
                if (err) throw err;
               // console.log(i);
           // })
        })
    })
    res.redirect('/servers/order/biggerplate')
});
router.post('/order/reset', (req, res) => {
    pool.query("TRUNCATE TABLE currentorders")
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
        .query('SELECT * FROM itemizedhistory Order by date;')
        .then(query_res => {
            for(let i = 0; i < query_res.rowCount; ++i) {
                query_res.rows[i].date = JSON.stringify(query_res.rows[i].date).substring(1,11);
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
            res.render('orderslist', data);
        });
});
router.get('/order/orderconfirm', (req, res) => {
    orderslist = []
    var total_order = ''
    var temp_price = 0.0
    var total_price = 0.0
    var fixprice = 0.0
    pool.query('SELECT * FROM currentorders;')
    .then(query_res => {
        for(let i = 0; i < query_res.rowCount; ++i) {
            orderslist.push(query_res.rows[i]);
        }
        for(let i = 0; i < orderslist.length; ++i){
            total_order += orderslist[i].orderstaken + " "
        }
        for(let i = 0; i < orderslist.length; ++i){
            if(orderslist[i].price != null){
                temp_price =  parseFloat(orderslist[i].price)
                total_price += temp_price
            }
        }
        fixprice = total_price.toFixed(2)
        console.log(total_order)
        res.render('orderconfirm',{total_order: total_order, total_price: fixprice});
        
    });
   
});
router.post('/order/confirm', (req, res) => {
    orderslist = []
    var total_order = ''
    var temp_price = 0.0
    var total_price = 0.0
    var fixprice = 0.0
    pool.query('SELECT * FROM currentorders;', (err, res) => {
        for(let i = 0; i < res.rowCount; ++i) {
            orderslist.push(res.rows[i]);
        }
        for(let i = 0; i < orderslist.length; ++i){
            total_order += orderslist[i].orderstaken + " "
        }
        for(let i = 0; i < orderslist.length; ++i){
            if(orderslist[i].price != null){
                temp_price =  parseFloat(orderslist[i].price)
                total_price += temp_price
            }
        }
        fixprice = total_price.toFixed(2)
        let{date} = req.body;
    pool.query("INSERT INTO itemizedhistory (date,item,price) VALUES($1,$2,$3)",[moment(date).format("YYYY-MM-DD"),total_order,fixprice], (err, result) => {
        console.log(total_order)
        if (err) throw err;
    })
    pool.query("TRUNCATE TABLE currentorders")
    })
    res.redirect('/servers/order')
})
module.exports = router;
