
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('views'))
app.use('/',require('./routes/index.js'));
app.use('/customers',require('./routes/customers.js'));
app.use('/managers',require('./routes/managers.js'));
app.use('/servers',require('./routes/servers.js'));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});