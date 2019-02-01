/** Main app for server
 * 1. to start a small REST API for pins
 * 2. serve index.html with backbone using this REST-API
 * STATUS: unfinished
 *
 * Note: use 'npm start' or set your environment variables
 * NODE_ENV=development
 * DEBUG=we2*
 *
 * @author Johannes Konert
 * @licence MIT
 *
 */
"use strict";

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const debug = require('debug')('we2:server');
const morgan = require('morgan');

// own modules
const restAPIchecks = require('./restapi/request-checks');
const errorResponseWare = require('./restapi/error-response');
const HttpError = require('./restapi/http-error');

const pictures = require('./routes/pictures');


// app creation
const app = express();

// Middlewares *************************************************
app.use(favicon(path.join(__dirname, 'public', 'img/faviconbeuth.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// logging
app.use(morgan('dev'));

// API request checks for API-version and JSON etc.
app.use(restAPIchecks);


// Routes ******************************************************
app.use('/pictures', pictures);





// (from express-generator boilerplate  standard code)
// Errorhandling and requests without proper URLs ************************
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    debug('Catching unmatched request to answer with 404');
    const err = new HttpError('Not Found', 404);
    next(err);
});

// register error handlers
errorResponseWare(app);

// Start server ****************************
app.listen(3000, (err) => {
    if (err !== undefined) {
        console.log(`Error on startup: ${err}`);
    } else {
        console.log('Listening on port 3000');
    }
});
