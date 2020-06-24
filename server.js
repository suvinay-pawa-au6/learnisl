const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("./db");
//For parsing data sent to express
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
const Register = require("./api/routes/Register");
const Login = require("./api/routes/Login");


//Using the routes
app.use("/Register", Register);
app.use("/Login", Login);

//Listening at port 8080

app.listen(7080, (err) => {
  if (err) return console.log(err);
  console.log("Listening on port");
});
