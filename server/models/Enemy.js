const { Schema, model } = require('mongoose');

const enemySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    desc: {
        type: String,
    }
});

const Enemy = model('Enemy', enemySchema);

module.exports = Enemy;