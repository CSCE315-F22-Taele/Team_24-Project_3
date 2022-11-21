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
    ssl: {rejectUnauthorized: false}
});
process.on('SIGINT', function() {
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


//orderC BUTTONS 
router.get('/orderC/bowlC', (req, res) => {
  entreearr = []
  pool
      .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              entreearr.push(query_res.rows[i]);
          }
          const data = {entreearr: entreearr};
          res.render('bowlC', data);
          console.log(entreearr.length);
          for(let i=0;i< entreearr.length;i++){
              router.post('/orderC/bowlC/entree/'+i, (req, res) => {
                  pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                      if (err) throw err;
                  })
              })
          }
      });
});


router.get('/orderC/drinksC', (req, res) => {
  res.render('drinksC');
});

router.get('/orderC/entreesC', (req, res) => {
  entreearr = []
  pool
      .query("SELECT item,price,category FROM inventory WHERE category = 'entree' ORDER by id;")
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              entreearr.push(query_res.rows[i]);
          }
          const data = {entreearr: entreearr};
          res.render('entreesC', data);
          console.log(entreearr.length);
          for(let i=0;i< entreearr.length;i++){
              router.post('/orderC/entrees/entree/'+i, (req, res) => {
                  pool.query("INSERT INTO currentorders VALUES ($1,$2)",[entreearr[i].item,entreearr[i].price], (err, result) => {
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
          for (let i = 0; i < query_res.rowCount; i++){
              entreearr.push(query_res.rows[i]);
          }
          const data = {entreearr: entreearr};
          res.render('sidesC', data);
          console.log(entreearr.length);
          for(let i=0;i< entreearr.length;i++){
              router.post('/orderC/sides/entree/'+i, (req, res) => {
                  pool.query("INSERT INTO currentorders VALUES ($1,$2)",[entreearr[i].item,entreearr[i].price], (err, result) => {
                      if (err) throw err;
                  })
              })
          }
      });
});

router.get('/orderC/biggerplateC', (req, res) => {
  entreearr = []
  pool
      .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              entreearr.push(query_res.rows[i]);
          }
          const data = {entreearr: entreearr};
          res.render('biggerplateC', data);
          console.log(entreearr.length);
          for(let i=0;i< entreearr.length;i++){
              router.post('/orderC/biggerplateC/entree/'+i, (req, res) => {
                  pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                      if (err) throw err;
                  })
              })
          }
      });
});

router.get('/orderC/plateC', (req, res) => {
  entreearr = []
  pool
      .query("SELECT item,price,category FROM inventory WHERE category = 'entree' OR category = 'sides' ORDER by id;")
      .then(query_res => {
          for (let i = 0; i < query_res.rowCount; i++){
              entreearr.push(query_res.rows[i]);
          }
          const data = {entreearr: entreearr};
          res.render('plateC', data);
          console.log(entreearr.length);
          for(let i=0;i< entreearr.length;i++){
              router.post('/orderC/plateC/entree/'+i, (req, res) => {
                  pool.query("INSERT INTO currentorders VALUES ($1,NULL)",[entreearr[i].item], (err, result) => {
                      if (err) throw err;
                  })
              })
          }
      });
});

router.get('/orderC',  (req, res) => {
  bowllist = []

  pool.query("SELECT price,item FROM inventory WHERE item = 'bowl' OR item = 'plate' OR item = 'biggerplate' Order by id ")
      .then(query_res => {
          for(let i = 0; i < query_res.rowCount; ++i) {
              bowllist.push(query_res.rows[i]);
          }
          const data = {bowllist: bowllist};
          res.render('orderC',data)
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
          pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Bowl: ", bowl_price], (err, result) => {
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
          pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Plate: ", plate_price], (err, result) => {
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
          pool.query("INSERT INTO currentorders VALUES ($1,$2)",["Biggerplate: ", plate_price], (err, result) => {
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
router.get('/orderslistC' , (req, res) => {
  orderslist = []
  pool
      .query('SELECT * FROM currentorders;')
      .then(query_res => {
          for(let i = 0; i < query_res.rowCount; ++i) {
              orderslist.push(query_res.rows[i]);
          }
          const data = {orderslist: orderslist};
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
      res.render('orderconfirmC',{total_order: total_order, total_price: fixprice});
      
  });
 
});
router.post('/orderC/confirm', (req, res) => {
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
  res.redirect('/customers/orderC')
})





module.exports = router;