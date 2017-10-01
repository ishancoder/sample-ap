const express = require('express');
const pg = require('pg');
const path = require('path');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

let client = new pg.Client(connectionString);
client.connect();

let app = express();

app.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/branches/:ifsc", function(req, res, next) {
    const ifsc = req.params['ifsc'];
    console.log("Incoming request for : " + ifsc);
    
    let query = client.query("SELECT ifsc, name AS bankName, branch, address, city, district, state FROM BRANCHES LEFT JOIN BANKS ON BRANCHES.bank_id = BANKS.id WHERE BRANCHES.ifsc = $1", [ifsc], function(err, result) {
        if(err) {
            return next(err);
        }
        if(result.rows.length === 0) {
            return res.json("{\"error\" : \"Invalid IFSC : " + ifsc + "\"}")
        }
        res.json(JSON.stringify(result.rows[0]));
    });
});

app.get("/findbranches", function(req, res, next) {
    const bank = req.query.bank.toUpperCase();
    const city = req.query.city.toUpperCase();

    let query = client.query("SELECT ifsc, name AS bankName, branch, address, city, district, state FROM BRANCHES LEFT JOIN BANKS ON BRANCHES.bank_id = BANKS.id WHERE BANKS.name = $1 AND BRANCHES.city = $2", [bank, city], function(err, result) {
        if(err) {
            return next(err);
        }
        if(result.rows.length === 0) {
            return res.json("{\"error\": \"No branches found for input bank : "+ bank + ", city : " + city + "\"}")
        }
        res.json(JSON.stringify(result.rows));
    });
});

app.listen(process.env.PORT || 8080, function() {
    console.log("Service Started.");
});