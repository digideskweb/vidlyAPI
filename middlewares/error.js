
function error(err, req, res, next) {
    res.send(500);send('Fatal DB Error');
}

module.exports = error;