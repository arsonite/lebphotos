/** This module defines the routes for pictures using mongoose
 *
 * @author Johannes Konert
 * @licence MIT
 *
 * @module routes/pictures
 * @type {Router}
 */


// modules
const express = require('express');
const logger = require('debug')('we2:pictures');
const codes = require('../restapi/http-codes');
const HttpError = require('../restapi/http-error.js');
const mongoose = require('mongoose');
mongoose.Promise = Promise; // let Mongoose use native ES6 Promises
let db = mongoose.connect('mongodb://localhost/we2', {
    promiseLibrary: Promise
});
//mongoose.connect('mongodb://localhost/we2');

// TODO add here your require for your own model file
const PictureModel = require('../models/picture.model.js');

const pictures = express.Router();

const storeKey = 'pictures';

function checkPutObj(putObj) {
    let validKeys = ['width', 'height', 'src', 'title', 'description', 'views', ];
    let putKeys = Object.keys(putObj)
    let areKeysValid = true;
    for (let k in putKeys) {
        areKeysValid = validKeys.includes(putKeys[k]);
    }
    return areKeysValid;
}

// routes **************
pictures.route('/')
    .get((req, res, next) => {
        let query = PictureModel.find({});
        query.exec()
            .catch(err => {
                next(new HttpError(`Internal db error: ${err.toString()}`, 500))
            })
            .then(items => {
                if (items.length < 1) {
                    res.status(204).end();
                } else {
                    res.status(200).json(items);
                }
            })

    })
    .post((req, res, next) => {
        req.body.timestamp = new Date().getTime();
        // TODO replace store and use mongoose/MongoDB
        // var result = store.insert(storeKey, req.body);
        let picture = new PictureModel(req.body);
        picture.save(err => {
            if (err) {
                next(err);
                return;
            }
            res.status(201).json(picture);
        });
        res.locals.processed = true;
        //next();
    })
    .all((req, res, next) => {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            let err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });

pictures.route('/:id')
    .get((req, res, next) => {
        let id = req.params.id;
        PictureModel.findById(id)
            .catch(err => {
                next(new HttpError(`Internal db error: ${err.toString()}`, 500));
            })
            .then(item => {
                if (item === null) {
                    res.status(204).end();
                } else {
                    res.status(200).json(item);
                }
            });
        res.locals.processed = true;

    })
    .put((req, res, next) => {
        let id = req.params.id;
        if (!(req.body._id === id)) {
            next(new HttpError('Putbody Id and Picture Id do not match, can not update', 400));
            return;
        }
        if (!checkPutObj(req.body)) {
            next(new HttpError('Cannot update _v or timestamp', 400));
            return;
        }
        PictureModel.findByIdAndUpdate(id, req.body, {
                runValidators: true,
                new: true
            })
            .catch(err => {
                if (err.errors) {
                    return next(new HttpError(err.message, 400));
                } else {
                    return next(new HttpError(`Internal db error: ${err.toString()}`, 500));
                }
            })
            .then(item => {
                if (item === null) {
                    next(new HttpError('Picture not found, update failed'), 400);
                    return;
                }
                logger(item);
                res.status(200).json(item);
            });



        res.locals.processed = true;
    })
    .delete((req, res, next) => {
        let id = req.params.id;
        PictureModel.findByIdAndDelete(id)
            .catch(err => {
                next(new HttpError(`Internal db error: ${err.toString()}`, 500));
            })
            .then(item => {
                if (item === null) {
                    return next(new HttpError("Item does not exist, can not be deleted", 400));
                }
                res.status(200).json(item);
            });
        res.locals.processed = true;
        //next();
    })
    .all((req, res, next) => {
        if (res.locals.processed) {
            next();
        } else {
            // reply with wrong method code 405
            let err = new HttpError('this method is not allowed at ' + req.originalUrl, codes.wrongmethod);
            next(err);
        }
    });

/**
 * This middleware would finally send any data that is in res.locals to the client (as JSON)
 * or, if nothing left, will send a 204.
 */

//Diese Middleware macht alles nur komplizierter ich habe sie daher auskommentiert.
//pictures.use((req, res, next) => {
//    if (res.locals.items) {
//        res.json(res.locals.items);
//        delete res.locals.items;
//    } else if (res.locals.processed) {
//        res.set('Content-Type', 'application/json'); // not really necessary if "no content"
//        if (res.get('Status-Code') == undefined) { // maybe other code has set a better status code before
//            res.status(204); // no content;
//        }
//        res.end();
//    } else {
//        next(); // will result in a 404 from app.js
//    }
//});

module.exports = pictures;
