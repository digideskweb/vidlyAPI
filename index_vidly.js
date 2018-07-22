const express = require('express');
const app = express();
const genre_router = require('./routers/genresWithDB');
const home_router = require('./homepage/home');
const morgan = require('morgan');
const mongoose = require('mongoose');


app.use(express.json());
app.use(morgan('tiny'));
app.use('/', home_router);
app.use('/api/genres', genre_router);
connectToMongo();

async function connectToMongo() {
    try {
        const result = await mongoose.connect('mongodb://localhost/playground');
        console.log("Connected to MongoDB");
    } catch (e) {
        console.log("Could not connect to MongoDB");
        console.log(e.message);
        
    }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Listening to PORT ${PORT}`, `Visit: http://localhost:${PORT}`);
    
});