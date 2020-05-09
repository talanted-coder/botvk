const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
   user_id: {
       type: Number
   },
    balance: {
        type: Number,
        default: 5
    }
});

module.exports = mongoose.model('users', UserSchema);