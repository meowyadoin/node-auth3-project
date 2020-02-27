const express = require('express');
const session = require('express-session');

const router = require('./router.js');
const middleware = require('./middleware.js')

const server = express();

middleware(server);

server.use(session({
    name: 'mysession',
    secret: 'secretsecret',
    cookie: {
        maxAge:  90 *1000,
        secure: false, // changed to true if in production
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false, //set to false, will later be dynamically changed. GDPR laws
}));
server.use('/api', router);


module.exports = server;