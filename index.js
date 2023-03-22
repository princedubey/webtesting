const express = require('express')
const bodyParser = require('body-parser')
const connect = require("./config/db")
const router = require("./routes/userRoute")
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// connect with datbase
connect();
// middlewaare
app.use(bodyParser.json());
// routing
app.use("/", router);


app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))