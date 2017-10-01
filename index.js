const express = require('express');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL || "postgres://edmynqjkishnfc:f6443300c7f634d81e6ee39522825d2cc191d5c0f2250de7360a7e9fb760f5d4@ec2-54-227-252-202.compute-1.amazonaws.com:5432/d8mjgv9gqsh3lr";

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

app.listen(process.env.PORT || 8080, function() {
    console.log("Service Started.");
});