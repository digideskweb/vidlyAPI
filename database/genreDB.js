const mongoose = require('mongoose');
const genreSchema = new mongoose.Schema({
                                            name: {
                                                type: String,
                                                required: true,
                                                minlength: 3,
                                                maxlength: 50,
                                                get: (genre) => {
                                                    return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                },
                                                set: (genre) => {
                                                    return (genre.charAt(0).toUpperCase() + genre.slice(1));
                                                }
                                            },
                                            id: {
                                                type: Number,
                                                required: true,
                                                unique: true,
                                                min: 1,
                                            }
                                        }, {toObject: {getters: true}});
const Genre = mongoose.model('genre', genreSchema);

async function getGenres() {
    try {
        console.log("Finding all Genres...");
        const genres = await Genre.find().select({_id: 0});
        return Promise.resolve({result: genres, message: null}); //need to return Promise so that it can be awaited
    } catch (e) {                                                // in genresWithDB file
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function createGenre(newGenre) {
    
    const genre = new Genre({
                                name: newGenre.name,
                                id: newGenre.id,
        
                            });
    
    try {
        const result = await genre.save(); //raises exception if genre doesnt match schema
        console.log(result);
        return Promise.resolve({result: result, message: null});
    } catch (e) {
        console.log("Could not save document");
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function getGenreById(id) {
    try {
        const genre = await Genre.find({id: id}).select({_id: 0});
        console.log(genre);
        return Promise.resolve({result: genre, message: null});
    } catch (e) {
        console.log('Could not find the genre');
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
        
    }
    
}

async function upDateGenreByID(updateElements) {
    try {
        const upDatedGenre = await Genre.findOneAndUpdate({id: updateElements.id},
                                                          {
                                                              $set: {
                                                                  name: updateElements.name
                                                              }
                                                          },
                                                          {new: true}
        );
        
        if (!upDatedGenre) {
            return Promise.resolve({result: null, message: `Genre with ID : ${updateElements.id} does not exist`});
        } else {
            return Promise.resolve({result: upDatedGenre, message: null});
        }
        
    } catch (e) {
        console.log("Could not update Genre");
        console.log(e.message);
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function removeGenreByID(id) {
    try {
        const genre = await Genre.findOneAndRemove({id: id});
        if (!genre) {
            return Promise.resolve({result: null, message: `Genre with ID : ${id} does not exist`});
        } else {
            return Promise.resolve({result: genre, message: null});
        }
    } catch (e) {
        console.log("Genre Removal Unsuccessfull");
        return Promise.resolve({result: null, message: e.message});
    }
    
}

module.exports = {
    getGenres,
    createGenre,
    getGenreById,
    upDateGenreByID,
    removeGenreByID,
};

