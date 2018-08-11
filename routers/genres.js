const express = require('express');
const router = express.Router();
const Joi = require('joi');
const genreDB = require('../database/genreDB');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const winston = require('winston');

const schema = {
    name: Joi.string().min(3).required(),
    id: Joi.number().min(1).required(),
};

//GET REQUEST TO SERVER TO SEE ALL GENRES
router.get('/', (req, res) => {
    
    genreDB.getGenres()
           .then((result) => {
               if (!result.message) {
                   res.send(result.result);
                   return;
               } else {
                   winston.log('error', result.message);
                   res.status(500).send("Fatal DB Error. " + result.message);
                   return;
               }
        
           });
    ; //no need for catch block. always returns resolved promise
    
});

//GET Request to Server to see a particular Genre
router.get('/:id', (req, res) => {
    //See if id of course exists
    const param_id = parseInt(req.params.id);
    
    genreDB.getGenreById(param_id)
           .then((result) => {
               if (!result.message) {
                   if (result.result.length === 0) {
                       res.status(404).send(`Genre with ID: ${param_id} doesnt exist`);
                       return;
                   } else {
                       res.send(result.result);
                       return;
                   }
            
               } else {
                   res.status(404).send(result.message);
                   return;
               }
        
           });
    
});
// POST Request to create a new genre
// auth middleware gets executed before the (req, res) middleware
router.post('/:id', auth, async (req, res) => {
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.id = param_id;
    const result = validateGenre(body);
    
    if (result.error) {
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    const userAlready = await genreDB.Genre.findOne({id: body.id});
    if (userAlready) {
        return res.status(400).send(`Genre with id ${body.id} already exists`);
    }
    
    const new_genre = {
        name: body.name,
        id: param_id,
    };
    
    genreDB.createGenre(new_genre)
           .then((result) => {
               if (!result.message) {
                   res.send(result.result);
                   return;
               } else {
                   res.status(404).send(result.message);
                   return;
               }
        
           });
    
});

//PUT Request to Update a particular Genre
router.put('/:id', (req, res) => {
    
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.id = param_id;
    
    const result = validateGenre(body);
    
    if (result.error) {
        res.status(404).send(`${result.error.details[0].message}`);
        return;
    } else {
        genreDB.upDateGenreByID(body)
               .then((result) => {
                   if (!result.result) {
                       res.status(404).send(result.message);
                   } else {
                       res.send(result.result);
                   }
               });
        
    }
    
});

//DELETE Request to Delete a Particular Genre
router.delete('/:id', [auth, admin], (req, res) => {
    const param_id = parseInt(req.params.id);
    
    genreDB.removeGenreByID(param_id)
           .then((result) => {
               if (!result.result) {
                   res.status(404).send(result.message);
                   return;
               } else {
                   res.send(result.result);
                   return;
               }
           });
    
});

function validateGenre(requestBody) {
    return Joi.validate(requestBody, schema);
    
}

module.exports = router;



