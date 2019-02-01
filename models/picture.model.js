/*****
 * */
'uses strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PictureSchema = new Schema({
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        src: {
            type: String,
            required: true
        },
        title: {
            type: String,
            maxlength: 140,
            default: ""
        },
        description: {
            type: String,
            maxlength: 1000,
            default: ""
        },
        views: {
            type: Number,
            min: 0,
            default: 0
        }
    }, {
        timestamps: {
            createdAt: 'timestamp',
            updatedAt: 'changed'
        }
    }

);

module.exports = mongoose.model('Picture', PictureSchema);
