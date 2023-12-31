const express = require("express");
const dotenv = require("dotenv").config();
const routes = require("./routes/index.js");
const db = require("./config/database/dbconfig.js");
const app = express();
const cors = require('cors');
app.use(cors({
    credentials: true,
    origin: ['https://seacinema-876cf.web.app','http://localhost:3000']
}));
app.use('/uploads',express.static('uploads'));
db()
app.use(express.json());
app.use(routes)
app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running port', process.env.APP_PORT);
});

module.exports = app;
