require('dotenv').config()
const db = require("./db.js"),
    pjson = require('./package.json'),
    bodyParser = require("body-parser"),
    express = require('express'),
    http = require("http"),
    app = express(),
    ip = require("ip"),
    os = require("os")
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

app.get("/:statement", async (req, res) => {
    if (!client.getAuth(req)) {
        res.status(401).send("You must be on the whitelist to access this API.");
        return;
    }
    if (!req.params.statement) res.send(pjson.name)
    const dbres = await db.raw(req.params.statement)
    res.json(dbres);
})

app.get("/", (req, res) => {
    res.send(pjson.name)
})

app.post("/", async (req, res) => {
    if (!client.postAuth(req)) {
        res.status(401).send("You must be on the whitelist to access this API.");
        return;
    }
    if (!req.body.statement) res.send(pjson.name)
    const dbres = await db.raw(req.body.statement)
    res.json(dbres);
})

server = http.createServer(app);
server.listen(process.env.PORT, () => {
    console.log(
        pjson.name + " on %s listening at http://%s:%s",
        os.hostname(),
        ip.address(),
        server.address().port
    );
})

const client = {
    getAuth(req) {
        return this.reqIpInList(req,process.env.GET_WHITELIST)
    },
    postAuth(req) {
        return this.reqIpInList(req,process.env.GET_WHITELIST)
    },
    reqIpInList(req, list) {
        if (!req || !req.connection || !req.ip || !list) return false
        if (list === '*') return true
        const reqIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)
        return list.indexOf(reqIp.split(/[:]+/).pop()) > -1
    }
}