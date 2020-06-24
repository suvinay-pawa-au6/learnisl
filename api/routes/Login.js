const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../model/User");
const Interpreter = require("../../model/Enterprise");
router.post("/:type", (req, res) => {
  if (req.params.type == "user") {
    // console.log(req.params.type);
    User.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "User does not exist",
          });
        }

        if (user.status == "inactive")
          return res.status(403).json({
            message: "Your account is inactive, please verify your email",
            email: req.body.email,
          });
        if (user.status == "locked")
          return res.status(403).json({
            message: "Your account is locked, please Reset your password",
            email: req.body.email,
          });
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) return res.status(401).json({ err });
          if (result) {
            var token = jwt.sign(
              {
                email: user.email,
                firstname: user.firstName,
                id: user._id,
                type: user.type,
              },
              "iuyiuweyiuyhewrf8743",
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message:
                "Login is succesfull , Here is your token . User should send it to access pages",
              token: token,
            });
          } else {
            return res
              .status(401)
              .json({ message: "incorrect password.Please try again" });
          }
        });
      })
      .catch((err) => {
        err;
      });
  } else if (req.params.type == "interpreter") {
    Interpreter.findOne({ email: req.body.email })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            message: "Interpretor does not exist",
          });
        }
        if (user.status == "inactive")
          return res.status(403).json({
            message: "Your account is inactive, please verify your email",
            email: req.body.email,
          });
        if (user.status == "locked")
          return res.status(403).json({
            message: "Your account is locked, please Reset your password",
            email: req.body.email,
          });

        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) return res.status(401).json({ err });
          if (result) {
            var token = jwt.sign(
              {
                email: user.email,
                name: user.name, 
                id: user._id,
              },
              "iuyiuweyiuyhewrf8743",
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              message:
                "Login is succesfull , Here is your token . User should send it to access pages",
              token: token,
            });
          } else {
            return res
              .status(401)
              .json({ message: "incorrect password.Please try again" });
          }
        });
      })
      .catch((err) => {
        err;
      });
  }
});

module.exports = router;
