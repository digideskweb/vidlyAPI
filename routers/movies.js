
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
            } else {
                res.status(404).send(result.message);
            }
        });
});

//GET Request to Server to see a particular Movie. The param id is an object id
router.get('/:id', (req, res) => {
    //See if id of movie exists
    const param_id = req.params.id;

    moviesDB.getMovieById(param_id)
        .then((result) => {
            if (!result.message) {
                if (result.result.length === 0) {
                    res.status(404).send(`Movie with ID: ${param_id} doesnt exist`);
                } else {
                    res.send(result.result);
                }

            } else {
                res.status(404).send(result.message);
            }

        });

});

// POST Request to create a new movie. The id param is a genre id
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
            } else {
                res.status(404).send(result.message);
            }

        });

});

//PUT Request to Update a particular Movie. The id param is a movie id
router.put('/:id', (req, res) => {

    const movie_id = String(req.params.id);
    const body = req.body;
    const result = validateMovie(body);

    if (result.error) {
        res.status(404).send(`${result.error.details[0].message}`);
        return;
    } else {

        // Joi validation passed now do a query if genre is still the same
        // or not

        moviesDB.getMovieById(movie_id)
            .then((result) => {
                if (!result.message) {
                    if (String(body.genreId) !== String(result.result[0].genre.id)) {
                        //Also need to update genre
                        genreDB.getGenreById(body.genreId)
                            .then((result) => {
                                if (!result.message) {
                                    // New Genre Exists
                                    delete body.genreId;
                                    body.id = movie_id;
                                    body.genre = new genreDB.Genre({
                                        name: result.result[0].name,
                                        id: result.result[0].id
                                    });

                                    moviesDB.updateMovieById(body)
                                        .then((result) => {
                                            //Updating
                                            console.log("Body is", body);
                                            if (!result.message) {
                                                res.send(result.result);
                                                return;
                                            } else {
                                                res.status(404).send(result.message);
                                            }
                                        });

                                } else {
                                    //New Genre Doesnt Exist
                                    res.status(404).send(result.message);
                                    return;
                                }
                            });

                    } else {
                        // No need to update genre
                        delete body.genreId;
                        body.id = movie_id;
                        moviesDB.updateMovieById(body)
                            .then((result) => {
                                //Updating
                                if (!result.message) {
                                    res.send(result.result);
                                    return;
                                } else {
                                    //Update not successfull
                                    res.status(404).send(result.message);
                                    return;

                                }
                            });

                    }

                    return;
                } else {
                    res.status(404).send(result.message);
                    return;
                }
            });

    }

});

//DELETE Request to Delete a Particular Customer. This id is a pure movie
// object id
router.delete('/:id', (req, res) => {
    const movie_id = String(req.params.id);

    moviesDB.removeMovieById(movie_id)
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

function validateMovie(movie) {
    return Joi.validate(movie, schema);
}

module.exports = router;