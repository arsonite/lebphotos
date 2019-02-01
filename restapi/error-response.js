/** This module provides middleware to respond with proper JSON error objects
 * using NODE_ENV setting to production or development. In dev mode it send the stacktrace.
 *
 * You call the returned function with an app instance
 *
 *  @author Johannes Konert
 * @licence  MIT
 *
 *
 * @module restapi/error-response
 * @type {Function}
 */
"use strict";
const logger = require('debug')('we2:error-response');

module.exports = function registerErrorHandlers(app) {
// development error handler
// will print stacktrace as JSON response
    if (app.get('env') === 'development') {
        app.use((err, req, res, next) => {
            let errorInformation = {
                error: {
                    statuscode: err.status,
                    message: err.message,
                    path: req.path,
                    error: err.stack.toString()
                }
            };
            console.log(`Error to send: ${JSON.stringify(errorInformation, null, 2)}`);
            res.status(err.status || 500);
            res.json(errorInformation);
        });
    }
    else {
        // production error handler
        // no stacktraces leaked to client
        app.use(function (err, req, res, next) {
            let errType = "Error";
            try { errType = err.constructor.name; } catch (e) {}
            res.status(err.status || 500);
            res.json({
                error: {
                    statuscode: err.status,
                    message: err.message,
                    path: req.path,
                    error: errType
                }
            });
        });
    }
};