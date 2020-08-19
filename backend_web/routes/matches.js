const matchesRouter = require("express").Router();
var db = require("../db/db.js");
// This is an extra way of speeding requests, where we cache in memory the data fetched if not empty for 30 seconds
let cachedData;
let cacheTime;

// This one is not needed actually but for testing purpose.
matchesRouter.get("/", async (req, res, next) => {
    if (cacheTime && cacheTime > Date.now - 30 * 1000) {
        return res.json(cachedData);
    }
    var sql = "select * from matches"
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
// Getting matches of a company with it's id 
matchesRouter.get("/:id", async (req, res, next) => {
    if (cacheTime && cacheTime > Date.now - 30 * 1000) {
        return res.json(cachedData);
    }
    var sql = "select companies.* from companies join matches on companies.id = matches.left_company_id where companies.id = ?"
    var params = [req.params.id]
    await db.all(sql, params, (err, row) => {
        if (err) {
            return res.status(400).json({ "error": err.message });
        }
        cachedData = row;
        cacheTime = Date.now;
        if (row.length == 0) {
            return res.json({
                "message": "There is no match for this id"
            });
        }
        else {
            return res.json(row);
        }
    });
});

module.exports = matchesRouter;