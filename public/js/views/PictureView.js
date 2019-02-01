/**
 *  @author Burak Günaydin
 *  @licence  MIT
 */
"use strict";
define(['backbone', 'jquery', 'underscore'], function (Backbone, $, _) {
    var PictureView = Backbone.View.extend({
        tagName: 'div',
        className: 'picture',
        template: _.template($('#pictureTemplate').text()),
        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        }
    });
    return PictureView;
});
