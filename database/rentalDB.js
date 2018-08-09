const mongoose = require('mongoose');

// not reusing customer and movie schema from their respective DB files,
// because a customer or movie can have 50 properties and we dont want all
// of the properties to populate here.
const customerSchemaForRental = new mongoose.Schema({
                                                        name: {
                                                            type: String,
                                                            required: true,
                                                            minlength: 5,
                                                            maxlength: 50
                                                        },
                                                        id: {
                                                            type: Number,
                                                            required: true,
                                                            unique: true,
                                                            min: 1
                                                        },
                                                        isGold: {
                                                            type: Boolean,
                                                            default: false,
                                                        },
                                                        phone: {
                                                            type: String,
                                                            required: true,
                                                            minlength: 5,
                                                            maxlength: 50
        
                                                        }
                                                    });

const movieSchemaForRental = new mongoose.Schema({
                                                     title: {
                                                         type: String,
                                                         required: true,
                                                         trim: true,
                                                         minlength: 5,
                                                         maxlength: 255
                                                     },
                                                     dailyRentalRate: {
                                                         type: Number,
                                                         required: true,
                                                         min: 0,
                                                         max: 255
        
                                                     }
                                                 });

const rentalSchema = new mongoose.Schema({
                                             customer: {
                                                 type: customerSchemaForRental,
                                                 required: true
                                             },
                                             movie: {
                                                 type: movieSchemaForRental,
                                                 require: true,
                                             },
                                             dateOut: {
                                                 type: Date,
                                                 required: true,
                                                 default: Date.now()
                                             },
                                             dateReturned: {
                                                 type: Date,
                                             },
                                             rentalFee: {
                                                 type: Number,
                                                 min: 0
                                             }
                                         });

const Rental = mongoose.model('rental', rentalSchema);

module.exports = Rental;