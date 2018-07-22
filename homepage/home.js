const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello, Welcome to API Home!");
});

module.exports = router;