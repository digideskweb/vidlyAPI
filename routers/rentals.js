const rentalDB = require('../database/rentalDB');
const Joi = require('joi');
const movieDB = require('../database/moviesDB');
const customerDB = require('../database/customerDB');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await rentalDB.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await rentalDB.findById(req.params.id);
    
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');
    
    res.send(rental);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    //customer id is integer id
    let customer = "";
    const result = await customerDB.getCustomerById(req.body.customerId);
    if (result.message) {
        return res.status(400).send('Invalid customer.' + result.message);
    } else {
        customer = result.result[0];
    }
    
    //movie id is object id
    let movie = "";
    const movieResult = await movieDB.getMovieById(req.body.movieId);
    if (movieResult.message) {
        return res.status(400).send('Invalid movie.' + movieResult.message);
    } else {
        movie = movieResult.result[0];
    }
    
    if (movie.numberInStock === 0) {
        return res.status(400).send('Movie not in stock.');
    }
    
    let rental = new rentalDB({
                                  customer: {
                                      _id: customer._id,
                                      id: customer.id,
                                      name: customer.name,
                                      phone: customer.phone,
                                      isGold: customer.isGold
                                  },
                                  movie: {
                                      _id: movie._id,
                                      title: movie.title,
                                      dailyRentalRate: movie.dailyRentalRate
                                  }
                              });
    
    //need to make sure both rental save and movie save occurs successfully.
    // if any one of them fails, this is going to be a problem. since
    // instock might be 1 but in actuality that only movie has been rented
    // out so it should be zero. We need "transactions" which make a set of
    // DB operations happen at the same time. If any one of them fails, both
    // of them roll back. In mongo, it is done via library Fawn through 2
    // phase commit. Google to know more.
    try {
        // This is a transaction via 2 phase commit
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}})
            .run();
        
        res.send(rental);
        
    } catch (e) {
        res.status(500).send('DB Transaction Failed ' + e.message);
        
    }
    
});

function validate(rental) {
    const schema = {
        customerId: Joi.number().min(1).required(),
        movieId: Joi.string().required()
    };
    
    return Joi.validate(rental, schema);
}

module.exports = router;