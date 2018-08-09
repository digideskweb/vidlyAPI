const express = require('express');
const app = express();
const genre_router = require('./routers/genres');
const home_router = require('./homepage/home');
const morgan = require('morgan');
const mongoose = require('mongoose');
const customers = require('./routers/customers');
const movies = require('./routers/movies');
const rentals = require('./routers/rentals');
const users = require('./routers/users');

app.use(express.json());
app.use(morgan('tiny'));
app.use('/', home_router);
app.use('/api/genres', genre_router);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);

connectToMongo();

async function connectToMongo() {
    try {
        const result = await mongoose.connect('mongodb://localhost/playground');
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log("Could not connect to MongoDB");
        console.log(e.message);
        process.exit(); // Terminates the app.listen running loop
        
    }
}

// Reason why program doesnt exit after failure to connect to DB is because
// both connectToMongo() and app.listen are async , and app.listen keeps on
// listening for connections even after async connect to mongo fails.

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Listening to PORT ${PORT}`, `Visit: http://localhost:${PORT}`);
    
});

