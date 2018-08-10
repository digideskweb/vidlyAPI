const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Joi = require('joi');
const userDB = require('../database/userDB');
const bcrypt = require('bcrypt-nodejs');

//POST request to register a user in userDB
router.post('/', async (req, res) => {
    
    const body = req.body;
    const result = validateUser(body);
    
    if (result.error) {
        res.status(400).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    let user = await userDB.User.findOne({email: body.email});
    if (user) {
        return res.status(400).send("User already registered");
    }
    user = new userDB.User({
                               name: body.name,
                               email: body.email,
                               password: body.password
        
                           });
    let salt = '';
    bcrypt.genSalt(10, (err, result_) => {
        if (err) {
            console.log(err);
        } else {
            salt = result_;
            bcrypt.hash(user.password, salt, undefined, async (err, result_) => {
                if (err) {
                    console.log(err);
                    return res.status(404).send("Could not save password." +
                                                    " Please try again");
                } else {
                    user.password = result_;
                    const userSaveResult = await user.save();
                    const token = user.generateAuthToken();
                    return res.header('x-auth-token', token).send(_.pick(userSaveResult, ['_id', 'name', 'email']));
                }
                
            });
        }
    });
    
});

function validateUser(user) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    
    return Joi.validate(user, schema);
}

module.exports = router;




