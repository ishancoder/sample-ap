const express = require('express');
const pg = require('pg');

const connectionString = "postgres://postgres:password@localhost:5432/bank";

let client = new pg.Client(connectionString);
client.connect();

let app = express();

app.get("/branches/:ifsc", function(req, res, next) {
    const id = req.params['ifsc'];
    console.log("Incoming request for : " + id);
    
    let query = client.query("SELECT ifsc, name AS bankName, branch, address, city, district, state FROM BRANCHES LEFT JOIN BANKS ON BRANCHES.bank_id = BANKS.id WHERE BRANCHES.ifsc = $1", [id], function(err, result) {
        if(err) {
            return next(err);
        }
        res.json(JSON.stringify(result.rows[0]));
    });
});

app.get("/branches/:bank/:city", function(req, res, next) {
    const bank = req.params['bank'];
    const city = req.params['city'];

    let query = client.query("SELECT ifsc, name AS bankName, branch, address, city, district, state FROM BRANCHES LEFT JOIN BANKS ON BRANCHES.bank_id = BANKS.id WHERE BANKS.name = $1 AND BRANCHES.city = $2", [bank, city], function(err, result) {
        if(err) {
            return next(err);
        }
        res.json(JSON.stringify(result.rows));
    });
});

app.listen(3000, function() {
    console.log("Listeneing on PORT: 3000");
});