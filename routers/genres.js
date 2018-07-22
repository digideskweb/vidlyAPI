const express = require('express');
const router = express.Router();
const Joi = require('joi');
const genreDB = require('../database/genreDB');
const genres = [
    {id: 1, name: 'Action'},
    {id: 2, name: 'Horror'},
    {id: 3, name: 'Romance'}

];

const schema = {
    name: Joi.string().min(3).required(),
};

//GET REQUEST TO SERVER TO SEE ALL GENRES
router.get('/', (req, res) => {
    res.send(genres);
    
});

//GET Request to Server to see a particular Genre
router.get('/:id', (req, res) => {
    //See if id of course exists
    const param_id = parseInt(req.params.id);
    const genre = genres.find(g => g.id === param_id);
    if (!genre) {
        res.status(404).send(`Course with ID: ${param_id} doesnt exist`);
        return;
    }
    
    return res.send(genre);
    
});
// POST Request to create a new genre
router.post('/', (req, res) => {
    const body = req.body;
    const result = validateGenre(body);
    
    if (result.error) {
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    const new_course = {
        name: body.name,
        id: genres.length + 1,
    };
    
    genres.push(new_course);
    res.send(new_course);
    
});

//PUT Request to Update a particular Genre
router.put('/:id', (req, res) => {
    
    const param_id = parseInt(req.params.id);
    const genre = genres.find(g => g.id === param_id);
    if (!genre) {
        res.status(404).send(`Course with ID: ${param_id} doesnt exist`);
        return;
    }
    const body = req.body;
    const result = validateGenre(body);
    
    if (result.error) {
        res.status(404).send(`BAD Request. ${result.error.details[0].message}`);
        return;
    }
    
    genre.name = body.name;
    res.send(genre);
    
});

//DELETE Request to Delete a Particular Genre
router.delete('/:id', (req, res) => {
    const param_id = parseInt(req.params.id);
    const genre = genres.find((g) => {
        return g.id === param_id;
    });
    if (!genre) {
        res.status(404).send(`Course with ID: ${param_id} doesnt exist`);
        return;
    }
    const indexOfElementToDelete = genres.findIndex((genre) => {
        return genre.id === param_id;
    });
    genres.splice(indexOfElementToDelete, 1);
    res.send(genre);
    return;
    
});

function validateGenre(requestBody) {
    return Joi.validate(requestBody, schema);
    
}

module.exports = router;




