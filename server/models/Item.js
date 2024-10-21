const { Schema, model } = require('mongoose');

const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

const Item = model('Item', itemSchema);

module.exports = Item;