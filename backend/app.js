const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const apiV1Routes = require('./routes/api/v1');
const Utils = require('./utils');




app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.use("/", (req, res, next)=>{
    req.app = {};
    req.app.ip = Utils.getIPFromReq(req);
    next();
});

app.use("/api/v1", apiV1Routes );

app.get('/health', (req, res) => { res.send({success: true, messsage: "", data: { health: "alive"}}); });

const server = app.listen(8081,()=> {  console.log(`Listening at http://${server.address().address}:${server.address().port}`);});


