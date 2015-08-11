var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    sqlite3 = require('sqlite3').verbose(),
    db = new sqlite3.Database(":memory:"),
    sql = require('./libs/sql.js');
//db = new sqlite3.Database('mydb.sqlite');

db.run("CREATE TABLE if not exists data (name TEXT, num INTEGER)");

app.use(express.static('public'));

app.route('/')
    .get(function (req, res) {
        res.render('index.jade', { title: "Drink Machine"});
    })
    .post(function (req, res) {
        console.log('form submit');
        res.render('index.jade');
    });
app.route('/add')
    .get(function (req, res) {
        res.render('add.jade', { title: "Add Drink"});
    })
    .post(function(req, res) {
        console.log('drink submitted');
        res.redirect('/');
    });

io.on('connection', function (socket) {
    console.log(socket.id + ' connected at ' + new Date().toTimeString());
    socket.emit('news', { hello: 'world' });
    socket.on('other', function(data) {
        console.log(data)
    });
    socket.on('testdata', function () {
        db.run("INSERT INTO data VALUES (?, ?)", ["drink-" + socket.id.substr(0, 3), Math.floor(Math.random() * 10).toString()], function (err) {
            if (err) {
                console.log(err)
            } else {
                sql.getData(db, function(data) {
                    console.log('sending ' + data);
                    io.emit('update', data);
                });
            }
        });
    }).on('disconnect', function() {
        console.log(socket.id + " disconnected at " + new Date().toTimeString())
    });
});

server.listen(3000, function () {
    console.log('listening on port 3000 - ' + new Date().toTimeString())
});
