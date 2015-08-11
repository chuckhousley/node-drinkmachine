module.exports = {
    getData: function (db, callback) {
        db.all('SELECT name, num FROM data', function (err, rows) {
            if (rows != undefined) {
                callback(JSON.stringify(rows));
            } else {
                console.log('database failure');
            }
        });
    }
};