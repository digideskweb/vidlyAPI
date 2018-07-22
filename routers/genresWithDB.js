const express = require('express');
const router = express.Router();
const Joi = require('joi');
const genreDB = require('../database/genreDB');

const schema = {
    name: Joi.string().min(3).required(),
    id: Joi.number().min(1).required(),
};

//GET REQUEST TO SERVER TO SEE ALL GENRES
router.get('/', (req, res) => {
    
    genreDB.connectToMongo({taskToDo: genreDB.getGenres})
           .then((result) => {
               if (!result.message) {
                   res.send(result.result);
                   return;
               } else {
                   res.status(404).send(result.message);
                   return;
               }
        
           }); //no need for catch block. always returns resolved promise
    
});

//GET Request to Server to see a particular Genre
router.get('/:id', (req, res) => {
    //See if id of course exists
    const param_id = parseInt(req.params.id);
    
    genreDB.connectToMongo({taskToDo: genreDB.getGenreById, id: param_id})
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
router.post('/:id', (req, res) => {
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.id = param_id;
    const result = validateGenre(body);
    
    if (result.error) {
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    const new_genre = {
        name: body.name,
        id: param_id,
    };
    
    genreDB.connectToMongo({taskToDo: genreDB.createGenre, id: new_genre})
           .then((result) => {
               if (!result.message) {
                   res.send(result.result);
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
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    } else {
        genreDB.connectToMongo({taskToDo: genreDB.upDateGenreByID, id: body})
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
router.delete('/:id', (req, res) => {
    const param_id = parseInt(req.params.id);
    
    genreDB.connectToMongo({taskToDo: genreDB.removeGenreByID, id: param_id})
           .then((result) => {
               if (!result.result) {
                   res.status(404).send(result.message);
                   return;
               } else {
                   console.log("RESULT!!!!!");
                   res.send(result.result);
                   return;
               }
           });
    
});

function validateGenre(requestBody) {
    return Joi.validate(requestBody, schema);
    
}

module.exports = router;




