const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
                                           name: {
                                               type: String,
                                               required: true,
                                               minlength: 5,
                                               maxlength: 50,
                                               get: (genre) => {
                                                   return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                               },
                                               set: (genre) => {
                                                   return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                               }
                                           },
                                           email: {
                                               type: String,
                                               required: true,
                                               minlength: 5,
                                               maxlength: 255,
                                               unique: true
                                           },
                                           password: {
                                               type: String,
                                               required: true,
                                               minlength: 5,
                                               maxlength: 1024
                                           }
                                       }, {toObject: {getters: true}});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, config.get("jwtPrivateKey"));
    return token;
    
};

const User = mongoose.model('user', userSchema);

module.exports = {
    userSchema,
    User,
};

