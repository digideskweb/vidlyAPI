const mongoose = require('mongoose');
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
const User = mongoose.model('user', userSchema);

module.exports = {
    userSchema,
    User,
};

