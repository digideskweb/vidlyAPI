const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('../static/html/index.hbs', {message: "Hello, Welcome to API Home!"})
});

module.exports = router;