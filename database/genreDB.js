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

async function connectToMongo({taskToDo, id}) {
    try {
        const result = await mongoose.connect('mongodb://localhost/playground');
        console.log("Connected to MongoDB");
        if (!id) {
            console.log("Initiating Database Task....");
            const res = await taskToDo();
            return Promise.resolve(res);
        } else {
            console.log("Initiating Database Task....");
            const res = await taskToDo(id);
            return Promise.resolve(res);
        }
        
    } catch (e) {
        console.log(e.message);
        return Promise.resolve({result: null, message: "Could not Connect to MongoDB"});
        
    }
    
}

async function getGenres() {
    try {
        console.log("Finding all Genres...");
        const genres = await Genre.find().select({_id: 0});
        closeDB();
        return Promise.resolve({result: genres, message: null});
    } catch (e) {
        closeDB();
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
        closeDB();
        return Promise.resolve({result: result, message: null});
    } catch (e) {
        console.log("Could not save document");
        console.log(e.message);
        closeDB();
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function getGenreById(id) {
    try {
        const genre = await Genre.find({id: id}).select({_id: 0});
        console.log(genre);
        closeDB();
        return Promise.resolve({result: genre, message: null});
    } catch (e) {
        console.log('Could not find the course');
        console.log(e.message);
        closeDB();
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
            closeDB();
            return Promise.resolve({result: null, message: `Genre with ID : ${updateElements.id} does not exist`});
        } else {
            closeDB();
            return Promise.resolve({result: upDatedGenre, message: null});
        }
        
    } catch (e) {
        console.log("Could not update Genre");
        console.log(e.message);
        closeDB();
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function removeGenreByID(id) {
    try {
        const genre = await Genre.findOneAndRemove({id: id});
        if (!genre) {
            closeDB();
            return Promise.resolve({result: null, message: `Genre with ID : ${id} does not exist`});
        } else {
            closeDB();
            return Promise.resolve({result: genre, message: null});
        }
    } catch (e) {
        console.log("Genre Removal Unsuccessfull");
        closeDB();
        return Promise.resolve({result: null, message: e.message});
    }
    
}

async function closeDB() {
    await mongoose.connection.close();
    console.log("DB Connection Closed");
}

module.exports = {
    connectToMongo,
    getGenres,
    createGenre,
    getGenreById,
    upDateGenreByID,
    removeGenreByID,
};

