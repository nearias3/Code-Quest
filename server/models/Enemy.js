const { Schema, model } = require('mongoose');

const enemySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    def: {
        type: Number,
        required: true,
    },
    hp: {
        type: Number,
        required: true,
    },
});

const Enemy = model('Enemy', enemySchema);

module.exports = Enemy;