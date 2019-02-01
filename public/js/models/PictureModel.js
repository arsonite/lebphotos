/**
 *  Backbone Model (stub)
 *  Connected to REST API /{ressourcepath}
 *
 *  @author Eric Wenzke
 *  @licence  MIT
 */

"use strict";

define(['backbone', 'underscore'], function (Backbone, _) {
    var PictureModel = Backbone.Model.extend({
        idAttribute: "_id",

        validate: function (obj) {
            if (typeof obj.views !== "number") {
                return "view attr is not a number"
            } else if (obj.views < 0) {
                return "there cannot be negative view values"
            }
            if (obj.title !== undefined) {
                if (typeof obj.title !== "string") {
                    return "title is not a string";
                } else if (obj.title.length > 140) {
                    return "title is longer than 140 chars";
                }
            }
            if (obj.description !== undefined) {
                if (typeof obj.description !== "string") {
                    return "description is not a string";
                } else if (obj.description.length > 1000) {
                    return "description is longer than 1000 chars";
                }
            }
            if (obj.views !== undefined) {
                if (typeof obj.views !== "number") {
                    return "views is not a number"
                } else if (obj.views < 0) {
                    return "views is below 0";
                }
            }
        }
    });
    return PictureModel;
});
