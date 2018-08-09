const mongoose = require('mongoose');
const genreDB = require('./genreDB');

const movieSchema = new mongoose.Schema({
                                            title: {
                                                type: String,
                                                required: true,
                                                minlength: 5,
                                                maxlength: 255,
                                                trim: true,
                                                get: (genre) => {
                                                    return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                },
                                                set: (genre) => {
                                                    return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                }
                                            },
                                            numberInStock: {
                                                type: Number,
                                                min: 0,
                                                max: 255,
                                                required: true,
        
                                            },
                                            dailyRentalRate: {
                                                type: Number,
                                                min: 0,
                                                max: 255,
                                                required: true,
                                            },
                                            genre: {
                                                type: genreDB.genreSchema,
                                                required: true,
                                            }
                                        }, {toObject: {getters: true}});

const Movie = mongoose.model('movie', movieSchema);

async function getMovies() {
    try {
        console.log("Finding All Movie...");
        const movies = await Movie.find();
        return Promise.resolve({result: movies, message: null});
    } catch (e) {
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
    }
}

async function createMovie({title, numberInStock, dailyRentalRate, genre}) {
    const movie = new Movie({
                                title: title,
                                numberInStock: numberInStock,
                                dailyRentalRate: dailyRentalRate,
                                genre: genre,
        
                            });
    console.log("The movie is:  ", movie);
    console.log("=".repeat(40));
    
    try {
        const result = await movie.save();
        console.log(result);
        return Promise.resolve({result: result, message: null});
    } catch (e) {
        console.log("Could not save movie");
        return Promise.resolve({result: null, message: e.message});
    }
    
};

async function getMovieById(id) {
    try {
        const movie = await Movie.find({_id: id});
        console.log(movie);
        return Promise.resolve({result: movie, message: null});
    } catch (e) {
        e.message = `Could not find the movie with id: ${id}. ` + e.message;
        return Promise.resolve({result: null, message: e.message});
        
    }
    
};

async function updateMovieById(updateRequestBody) {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(
            {_id: updateRequestBody.id},
            {$set: updateRequestBody},
            {new: true}
        );
        
        if (!updatedMovie) {
            return Promise.resolve({
                                       result: null,
                                       message: `Movie with id: ${updateRequestBody.id} doesnt exist`
                                   });
        } else {
            return Promise.resolve({result: updatedMovie, message: null});
        }
        
    } catch (e) {
        e.message = "Could not update movie. " + e.message;
        return Promise.resolve({result: null, message: e.message});
        
    }
}

async function removeMovieById(id) {
    try {
        const movie = await Movie.findOneAndRemove({_id: id});
        if (!movie) {
            return Promise.resolve({
                                       result: null,
                                       message: `Movie with ID : ${id} does not exist`
                                   });
        } else {
            return Promise.resolve({result: movie, message: null});
        }
    } catch (e) {
        console.log("Movie Removal Unsuccessfull");
        return Promise.resolve({result: null, message: e.message});
    }
    
}

module.exports = {
    getMovies,
    createMovie,
    getMovieById,
    updateMovieById,
    removeMovieById,
};

