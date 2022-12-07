const express = require('express');
const { redirect } = require('express/lib/response');
const router = express.Router();
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
    ssl: { rejectUnauthorized: false }
});
process.on('SIGINT', function () {
    pool.end();
    console.log('routerlication successfully shutdown');
    process.exit(0);
});

router.get('/customers', (req, res) => {
    res.render('customers');
});

router.get('/locations', (req, res) => {
    res.render('locations');
});

router.get('/nutrition', (req, res) => {
    res.render('nutrition');
});

router.get('/submissionR', (req, res) => {
    res.render('submissionR');
});

//orderC BUTTONS 
router.get('/orderC/bowlC', (req, res) => {
    entreearr = []
    var entree_count = 0;
    var sides_count = 0;
    let errors = [];
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                entreearr.push(query_res.rows[i]);
            }
            const data = { entreearr: entreearr };
            res.render('bowlC', data);
            router.post('/orderC/bowlC/return/', (req, res) => {
                console.log(entree_count)
                if (entree_count < 1 || sides_count < 1) {
                    if (entree_count < 1) {
                        errors.push({ message: "please choose 1 entree" });
                    }
                    if (sides_count < 1) {
                        errors.push({ message: "please choose 1 side" });
                    }
                    if (errors.length > 0) {
                        res.render('bowlC', { errors });
                        errors = []
                    }
                }
                else {
                    res.redirect('/customers/orderC')
                    entree_count = 0;
                    sides_count = 0;
                }
            })
            for (let j = 0; j < entreearr.length; j++) {
                router.post('/orderC/bowlC/entree/' + j, (req, res) => {

                    console.log(entree_count)
                    if ((entreearr[j].category == 'entree' && entree_count >= 1) || (entreearr[j].category == 'sides' && sides_count >= 1)) {
                        if ((entreearr[j].category == 'entree' && entree_count == 1)) {
                            errors.push({ message: "You can only choose at maximum 1 entree for a bowl!" });
                        }
                        if ((entreearr[j].category == 'sides' && sides_count == 1)) {
                            errors.push({ message: "You can only choose at maximum 1 side for a bowl!" });
                        }
                        if (errors.length > 0) {
                            res.render('bowlC', { errors });
                            errors = []
                        }
                    }
                    else {
                        pool.query("INSERT INTO currentorders VALUES ($1,NULL)", [entreearr[j].item], (err, result) => {
                            if (err) throw err;
                        })
                        if ((entreearr[j].category == 'entree' && entree_count < 1)) {
                            entree_count++;
                        }
                        if ((entreearr[j].category == 'sides' && sides_count < 1)) {
                            sides_count++;
                        }
                    }
                });

            }
        });

});






router.get('/orderC/entreesC', (req, res) => {
    entreearr = []
    let errors = [];
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                entreearr.push(query_res.rows[i]);
            }
            const data = { entreearr: entreearr };
            res.render('entreesC', data);
            console.log(entreearr.length);
            for (let i = 0; i < entreearr.length; i++) {
                router.post('/orderC/entreesC/entree/' + i, (req, res) => {
                    console.log(entreearr[i].item + " has been added to your order");
                    errors.push({ message: entreearr[i].item + " has been added to your order" });
                    res.render('entreesC', { errors });
                    errors = [];
                    pool.query("INSERT INTO currentorders VALUES ($1,$2)", [entreearr[i].item, entreearr[i].price], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/orderC/sidesC', (req, res) => {
    entreearr = []
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                entreearr.push(query_res.rows[i]);
            }
            const data = { entreearr: entreearr };
            res.render('sidesC', data);
            console.log(entreearr.length);
            for (let i = 0; i < entreearr.length; i++) {
                router.post('/orderC/sidesC/entree/' + i, (req, res) => {
                    pool.query("INSERT INTO currentorders VALUES ($1,$2)", [entreearr[i].item, entreearr[i].price], (err, result) => {
                        if (err) throw err;
                    })
                })
            }
        });
});

router.get('/orderC/biggerplateC', (req, res) => {
    entreearr = []
    var entree_count = 0;
    var sides_count = 0;
    let errors = [];
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                entreearr.push(query_res.rows[i]);
            }
            const data = { entreearr: entreearr };
            res.render('biggerplateC', data);
            router.post('/orderC/biggerplateC/return/', (req, res) => {
                console.log(entree_count)
                if (entree_count < 3 || sides_count < 1) {
                    if (entree_count < 3) {
                        errors.push({ message: "please choose 3 entrees" });
                    }
                    if (sides_count < 1) {
                        errors.push({ message: "please choose 1 side" });
                    }
                    if (errors.length > 0) {
                        res.render('biggerplateC', { errors });
                        errors = []
                    }
                }
                else {
                    res.redirect('/customers/orderC')
                    entree_count = 0;
                    sides_count = 0;
                }
            })
            for (let j = 0; j < entreearr.length; j++) {
                router.post('/orderC/biggerplateC/entree/' + j, (req, res) => {

                    console.log(entree_count)
                    if ((entreearr[j].category == 'entree' && entree_count >= 3) || (entreearr[j].category == 'sides' && sides_count >= 1)) {
                        if ((entreearr[j].category == 'entree' && entree_count == 3)) {
                            errors.push({ message: "You can only choose at maximum 3 entrees for a biggerplate!" });
                        }
                        if ((entreearr[j].category == 'sides' && sides_count == 1)) {
                            errors.push({ message: "You can only choose at maximum 1 side for a biggerplate!" });
                        }
                        if (errors.length > 0) {
                            res.render('biggerplateC', { errors });
                            errors = []
                        }
                    }
                    else {
                        pool.query("INSERT INTO currentorders VALUES ($1,NULL)", [entreearr[j].item], (err, result) => {
                            if (err) throw err;
                        })
                        if ((entreearr[j].category == 'entree' && entree_count < 3)) {
                            entree_count++;
                        }
                        if ((entreearr[j].category == 'sides' && sides_count < 1)) {
                            sides_count++;
                        }
                    }
                });

            }
        });

});

router.get('/orderC/plateC', (req, res) => {
    entreearr = []
    entreelength = []
    var entree_count = 0;
    var sides_count = 0;
    let errors = [];
    pool
        .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; i++) {
                entreearr.push(query_res.rows[i]);
            }
            const data = { entreearr: entreearr };
            res.render('plateC', data);
            pool.query("SELECT item,price,category FROM inventory WHERE category = 'entree'")
                .then(query_res => {
                    for (let k = 0; k < query_res.rowCount; k++) {
                        entreelength.push(query_res.rows[k]);
                    }
                    router.post('/orderC/plateC/return/', (req, res) => {
                        console.log(entree_count)
                        if (entree_count < 2 || sides_count < 1) {
                            if (entree_count < 2) {
                                errors.push({ message: "please choose 2 entrees" });
                            }
                            if (sides_count < 1) {
                                errors.push({ message: "please choose 1 side" });
                            }
                            if (errors.length > 0) {
                                res.render('plateC', { errors });
                                errors = []
                            }
                        }
                        else {
                            res.redirect('/customers/orderC')
                            entree_count = 0;
                            sides_count = 0;
                        }
                    })
                    for (let j = 0; j < entreearr.length; j++) {
                        router.post('/orderC/plateC/entree/' + j, (req, res) => {

                            console.log(entree_count)
                            if ((entreearr[j].category == 'entree' && entree_count >= 2) || (entreearr[j].category == 'sides' && sides_count >= 1)) {
                                if ((entreearr[j].category == 'entree' && entree_count == 2)) {
                                    errors.push({ message: "You can only choose at maximum 2 entrees for a plate!" });
                                }
                                if ((entreearr[j].category == 'sides' && sides_count == 1)) {
                                    errors.push({ message: "You can only choose at maximum 1 side for a plate!" });
                                }
                                if (errors.length > 0) {
                                    res.render('plateC', { errors });
                                    errors = []
                                }
                            }
                            else {
                                pool.query("INSERT INTO currentorders VALUES ($1,NULL)", [entreearr[j].item], (err, result) => {
                                    if (err) throw err;
                                })
                                if ((entreearr[j].category == 'entree' && entree_count < 2)) {
                                    entree_count++;
                                }
                                if ((entreearr[j].category == 'sides' && sides_count < 1)) {
                                    sides_count++;
                                }
                            }
                        });

                    }
                })
        });

});

router.get('/orderC', (req, res) => {
    bowllist = []

    pool.query("SELECT price,item FROM inventory WHERE item = 'bowl' OR item = 'plate' OR item = 'biggerplate' Order by id ")
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; ++i) {
                bowllist.push(query_res.rows[i]);
            }
            const data = { bowllist: bowllist };
            res.render('orderC', data)
        });

});
//const data = {orderarr: orderarr};
//res.render('order', data);

//for(let i=1;i<= orderarr.length;i++){
//router.post('/orderC/'+i, (req, res) => {
//pool.query("INSERT INTO currentorders VALUES ($1,$2)",[orderarr[i].item, orderarr[i].price], (err, result) => {
//if (err) throw err;
// console.log(i);
// })
//})
//}
//});
//});
router.post('/orderC/bowlC', (req, res) => {
    var bowl_price
    pool.query("SELECT price FROM inventory WHERE item = 'bowl'", (err, result) => {
        if (err) throw err;
        bowl_price = result.rows[0].price;
        pool.query("INSERT INTO currentorders VALUES ($1,$2)", ["Bowl: ", bowl_price], (err, result) => {
            if (err) throw err;
            // console.log(i);
            // })
        })
    })
    res.redirect('/customers/orderC/bowlC')
});
router.post('/orderC/plateC', (req, res) => {
    var plate_price
    pool.query("SELECT price FROM inventory WHERE item = 'plate'", (err, result) => {
        if (err) throw err;
        plate_price = result.rows[0].price;
        pool.query("INSERT INTO currentorders VALUES ($1,$2)", ["Plate: ", plate_price], (err, result) => {
            if (err) throw err;
            // console.log(i);
            // })
        })
    })
    res.redirect('/customers/orderC/plateC')
});
router.post('/orderC/biggerplateC', (req, res) => {
    var plate_price
    pool.query("SELECT price FROM inventory WHERE item = 'biggerplate'", (err, result) => {
        if (err) throw err;
        plate_price = result.rows[0].price;
        pool.query("INSERT INTO currentorders VALUES ($1,$2)", ["Biggerplate: ", plate_price], (err, result) => {
            if (err) throw err;
            // console.log(i);
            // })
        })
    })
    res.redirect('/customers/orderC/biggerplateC')
});
router.post('/orderC/reset', (req, res) => {
    pool.query("TRUNCATE TABLE currentorders")
});
router.get('/orderslistC', (req, res) => {
    orderslist = []
    pool
        .query('SELECT * FROM currentorders;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; ++i) {
                console.log(query_res.rows[i]);
                orderslist.push(query_res.rows[i]);
            }
            const data = { orderslist: orderslist };
            res.render('orderslistC', data);
        });
});
router.get('/orderC/orderconfirmC', (req, res) => {
    orderslist = []
    var total_order = ''
    var temp_price = 0.0
    var total_price = 0.0
    var fixprice = 0.0
    pool.query('SELECT * FROM currentorders;')
        .then(query_res => {
            for (let i = 0; i < query_res.rowCount; ++i) {
                orderslist.push(query_res.rows[i]);
            }
            for (let i = 0; i < orderslist.length; ++i) {
                total_order += orderslist[i].orderstaken + " "
            }
            for (let i = 0; i < orderslist.length; ++i) {
                if (orderslist[i].price != null) {
                    temp_price = parseFloat(orderslist[i].price)
                    total_price += temp_price
                }
            }
            fixprice = total_price.toFixed(2)
            console.log(total_order)
            res.render('orderconfirmC', { total_order: total_order, total_price: fixprice });

        });

});
router.post('/orderC/confirm', (req, res) => {
    orderslist = []
    var total_order = ''
    var temp_price = 0.0
    var total_price = 0.0
    var fixprice = 0.0
    let errors = []
    let { date } = req.body;
    if (moment(date, 'YYYY-MM-DD', true).isValid() == false) {
        errors.push({ message: "Please enter correct date format" });
        pool.query('SELECT * FROM currentorders;')
            .then(query_res => {
                for (let i = 0; i < query_res.rowCount; ++i) {
                    orderslist.push(query_res.rows[i]);
                }
                for (let i = 0; i < orderslist.length; ++i) {
                    total_order += orderslist[i].orderstaken + " "
                }
                for (let i = 0; i < orderslist.length; ++i) {
                    if (orderslist[i].price != null) {
                        temp_price = parseFloat(orderslist[i].price)
                        total_price += temp_price
                    }
                }
                fixprice = total_price.toFixed(2)
                res.render('orderconfirmC', { total_order: total_order, total_price: fixprice, errors });
                errors = []
            });
    }
    else {
        res.redirect('/submissionR/submissionR')
        pool.query('SELECT * FROM currentorders;', (err, res) => {
            for (let i = 0; i < res.rowCount; ++i) {
                orderslist.push(res.rows[i]);
            }
            for (let i = 0; i < orderslist.length; ++i) {
                total_order += orderslist[i].orderstaken + " "
            }
            for (let i = 0; i < orderslist.length; ++i) {
                if (orderslist[i].price != null) {
                    temp_price = parseFloat(orderslist[i].price)
                    total_price += temp_price
                }
            }
            fixprice = total_price.toFixed(2)

            pool.query("INSERT INTO itemizedhistory (date,item,price) VALUES($1,$2,$3)", [moment(date).format("YYYY-MM-DD"), total_order, fixprice], (err, result) => {
                if (err) throw err;
            })
            pool.query("TRUNCATE TABLE currentorders")

        })
    }

})


module.exports = router;
