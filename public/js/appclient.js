/** Main application file to start the client side single page app (only a stub for Ü4)
 *
 * @author Johannes Konert, Eric Wenzke
 * @licence  MIT
 */
"use strict";

requirejs.config({
    baseUrl: "./js",
    paths: {
        jquery: '_lib/jquery-1.11.3',
        underscore: '_lib/underscore-1.8.3',
        backbone: '_lib/backbone-1.2.3',
    },
    shim: {
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
    }
});

// AMD conform require as provided by require.js
require(['jquery', 'backbone', "models/PictureModel", "models/PictureCollection", "views/PictureListView"], function ($, Backbone, PictureModel, PictureCollection, PictureListView) {
    console.log("JavaScript is running!");
    var Router = Backbone.Router.extend({
        routes: {
            '': 'showPage'
        },
        showPage: function () {
            //$('body').prepend('<h1>Bildergallerie App</h1>');
            let col = new PictureCollection();

            col.fetch({
                success: function () {
                    console.log(col.models.length);

                    let pictureListView = new PictureListView({
                        collection: col
                    });
                    pictureListView.render();

                    /*let config = {model:col.at(0)};
                    let pictureView = new PictureView(config);
                    pictureView.render();
                    $('#gallery').append(pictureView.el);*/
                },
                error: function () {
                    console.log("Something went wrong...")
                }
            });
        },
    });
    var router = new Router();

    // finally start tracking URLs to make it a SinglePageApp (not really needed at the moment)
    Backbone.history.start({
        pushState: true
    }); // use new fancy URL Route mapping without #
});
