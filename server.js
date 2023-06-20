const express = require("express");
const sensor = require("node-dht-sensor");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const dbFile = './sensor.db';
const app = express();
const favicon = require('serve-favicon');
const PiCamera = require('pi-camera');
const myCamera = new PiCamera({
  mode: 'photo',
  output: `${ __dirname}/public/images/snap.jpg`,
  width: 640,
  height: 480,
  nopreview: true,
});
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public/js'));
app.use(express.static(__dirname + '/public/images'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

let db = new sqlite3.Database(dbFile);
const sql = `CREATE TABLE IF NOT EXISTS readings (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             datetime INTEGER,
             temperature REAL,
             humidity REAL)`

db.run(sql);
db.close();

function readSensor() {
    sensor.read(22, 4, function(err, temperature, humidity) {
        if (!err) {
            db = new sqlite3.Database(dbFile);
            var datetime = Date.now();

            db.run(`INSERT INTO readings (datetime, temperature,  humidity) VALUES (?, ?, ?)`,
                [datetime, temperature.toFixed(2), humidity.toFixed(2)]);

            db.close();
        }
    });
}

function captureWebcam() {
 myCamera.snap()
  .then((result) => {
    // Your picture was captured
  })
  .catch((error) => {
     // Handle your error
  });
}

app.get('/',
    function(req, res) {
        db = new sqlite3.Database(dbFile);

        let sqlStatement = "SELECT * FROM (SELECT * FROM readings ORDER BY id DESC LIMIT 96) sub ORDER BY id ASC"; //select last 24 hours of entries (assumes 15 min sensor read intervals)
        let filter = "1-Day";

        if(req.query.filter == "all"){
            sqlStatement = "SELECT * FROM readings";
            filter = "All";
        }

        if(req.query.filter == "month"){
            sqlStatement = "SELECT * FROM (SELECT * FROM readings ORDER BY id DESC LIMIT 2880) sub ORDER BY id ASC"; //select last 30 days of entries (assumes 15 min sensor read intervals)
            filter = "30-Day";
        }

        db.all(sqlStatement, (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            return row ?
                res.render("chart", {chartdata : row, filtertype : filter} ) :
                res.send("No result.");
        });
        db.close();
    });

setInterval(captureWebcam, 5000);
setInterval(readSensor, 900000); //15 mins in ms

app.listen(port);

