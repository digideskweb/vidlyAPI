const express = require('express');
const _ = require('lodash');
const router = express.Router();
const Joi = require('joi');
const userDB = require('../database/userDB');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

//GET REQUEST TO SERVER TO SEE ALL GENRES
router.post('/', async (req, res) => {
    
    const body = req.body;
    const result = validate(body);
    
    if (result.error) {
        res.status(400).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    let user = await userDB.User.findOne({email: body.email});
    if (!user) {
        return res.status(400).send("Invalid email or password");
    }
    
    bcrypt.compare(body.password, user.password, (err, result) => {
        if (err) {
            res.status(400).send("Could not match password. ");
        } else {
            if (result) {
                const token = jwt.sign({_id: user._id}, 'key');
                res.send(token);
            } else {
                res.status(400).send("Invalid email or password ");
            }
            
        }
    });
    
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
    
    return Joi.validate(req, schema);
}

module.exports = router;




