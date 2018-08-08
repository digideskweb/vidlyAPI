const express = require('express');
const Joi = require('joi');
const moviesDB = require('../database/moviesDB');
const genreDB = require('../database/genreDB');
const router = express.Router();


const schema = {
    title: Joi.string().min(5).max(255).required(),
    genreId: Joi.number().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
};

//GET Request to server to see all movies
router.get('/', (req, res) => {
    moviesDB.getMovies()
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

//GET Request to Server to see a particular Movie
router.get('/:id', (req, res) => {
    //See if id of movie exists
    const param_id = parseInt(req.params.id);
    
    moviesDB.getMovieById(param_id)
            .then((result) => {
                if (!result.message) {
                    if (result.result.length === 0) {
                        res.status(404).send(`Movie with ID: ${param_id} doesnt exist`);
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

// POST Request to create a new movie
router.post('/:id', async (req, res) => {
    const param_id = parseInt(req.params.id);
    const body = req.body;
    body.genreId = param_id;
    const result_ = validateMovie(body);
    
    if (result_.error) {
        res.status(404).send(`BAD Request. ${result_.error.details[0].message}`);
        return;
    }
    
    const result = await genreDB.getGenreById(param_id);
    let genre_ = "";
    
    if (!result.message) {
        if (result.result.length === 0) {
            res.status(404).send(`Genre with ID: ${param_id} doesnt exist`);
            return;
        } else {
            genre_ = result.result;
            console.log("Genre ISS: ", genre_);
            
        }
        
    } else {
        res.status(404).send(result.message);
        return;
    }
    
    const new_movie = {
        title: body.title,
        numberInStock: body.numberInStock,
        dailyRentalRate: body.dailyRentalRate,
        genre: new genreDB.Genre({
                                     name: genre_[0].name,
                                     id: genre_[0].id,
            
                                 })
        
    };
    
    moviesDB.createMovie(new_movie)
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

function validateMovie(movie) {
    return Joi.validate(movie, schema);
}

module.exports = router;