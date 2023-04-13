const express = require("express");
const cors = require("cors");
const app = express();
const absen = require('./index');
const absen2 = require('./latihan');
require('dotenv').config();

global.__basedir = __dirname;

var corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Backend App untuk cek absen kolabjar" });
});

app.post("/dataabsen", absen.getabsen);
app.post("/dataabsen1", absen2.getabsen);


//require('./src/routes/auth.routes.js')(app);
//require('./src/routes/aplikasi.routes.js')(app);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});