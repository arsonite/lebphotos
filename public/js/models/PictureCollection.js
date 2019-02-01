/**
 *  Backbone Model (stub)
 *  Connected to REST API /{ressourcepath}
 *
 *  @author Eric Wenzke
 *  @licence  MIT
 */

"use strict";

define(['backbone', 'underscore', "./PictureModel"], function (Backbone, _, PictureModel) {
    var PictureCollection = Backbone.Collection.extend({
        model: PictureModel,
        url: '/pictures'
    });
    return PictureCollection;
});
