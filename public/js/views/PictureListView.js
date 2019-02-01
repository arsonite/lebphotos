/**
 *  @author Burak Günaydin
 *  @licence  MIT
 */
"use strict";
define(['backbone', 'jquery', 'underscore', 'views/PictureView'], function (Backbone, $, _, PictureView) {
    var PictureListView = Backbone.View.extend({
        el: '#gallery',
        template: undefined,
        render: function () {
            this.$el.empty();
            this.collection.each(function (image) {
                var pictureView = new PictureView({
                    model: image
                });
                this.$el.prepend(pictureView.render().el);
            }, this);
            return this;
        },
        initialize: function () {
            this.listenTo(this.collection, 'add', this.render);
        }
    });
    return PictureListView;
});
