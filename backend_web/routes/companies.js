const companiesRouter = require("express").Router();
var db = require("../db/db.js");
// This is an extra way of speeding requests, where we cache in memory the data fetched if not empty for 30 seconds
let cachedData;
let cacheTime;

// Fetching all the companies from the database
companiesRouter.get("/", async (req, res, next) => {
    if (cacheTime && cacheTime > Date.now - 30 * 1000) {
        return res.json(cachedData);
    }
    var sql = "select * from companies"
    var params = []
    await db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        cachedData = rows;
        cacheTime = Date.now;
        return res.json(rows);
    });
});

// Fetching the informations of a given company by its Id
// No need for caching because this query is very light
companiesRouter.get("/:id", (req, res, next) => {
    var sql = "select * from companies where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        return res.status(200).json(row);
    });
});



module.exports = companiesRouter;