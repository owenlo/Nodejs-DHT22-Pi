const express = require("express");
const sensor = require("node-dht-sensor");
const port = 3000;
const sqlite3 = require('sqlite3').verbose();
const dbFile = './sensor.db';

const app = express();
app.set("view engine", "ejs"); 
app.set("views", __dirname + "/views"); ; 

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

app.get('/sensor',
    function(req, res) {
        db = new sqlite3.Database(dbFile);

        db.get('SELECT * FROM readings WHERE id = (SELECT MAX(id) FROM readings)', (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            return row ?
                res.send({ id: row.id, datetime: row.datetime, temperature: row.temperature, humidity: row.humidity}) :
                res.send("No result.");

        });

        db.close();

    });

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

setInterval(readSensor, 900000); //15 mins in ms

app.listen(port);