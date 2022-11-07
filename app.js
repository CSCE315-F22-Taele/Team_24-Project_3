const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
app.use(bodyParser.urlencoded());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('views'))

//LANDING PAGE 
app.use('/',require('./routes/index.js'));

//CUSTOMERS 
app.use('/customers',require('./routes/customers.js'));


//MANAGERS
app.use('/inventory',require('./routes/managers.js'));
app.use('/saleshistory',require('./routes/managers.js'));
app.use('/employeelist',require('./routes/managers.js'));
app.use('/menu', require('./routes/managers.js'));
app.use('/managers',require('./routes/managers.js'));

//SERVERS
app.use('/servers',require('./routes/servers.js'));
app.use('/restockreport',require('./routes/servers.js'));
app.use('/order',require('./routes/servers.js'))
app.use('/itemsales',require('./routes/servers.js'))


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});