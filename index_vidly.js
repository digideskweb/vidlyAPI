const express = require('express');
const app = express();
const genre_router = require('./routers/genresWithDB');
const home_router = require('./homepage/home');
const morgan = require('morgan');

app.use(express.json());
app.use(morgan('tiny'));
app.use('/', home_router);
app.use('/api/genres', genre_router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
    console.log(`Listening to PORT ${PORT}`);
    
});