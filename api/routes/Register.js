const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../model/User");
const Interpretor = require("../../model/Enterprise");
const nodemailer = require("nodemailer");

router.post("/user", (req, res) => {
  console.log(req.body);
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Id exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
              status: "inactive",
              firstName: req.body.firstname,
              lastName: req.body.lastname,
              vcode: Math.floor(100000 + Math.random() * 900000),
              type: req.body.type,
            });
            user.save((err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              console.log(result);
              res.status(200).json({
                message: "Please Verify your email to Continue",
                details: [
                  {
                    email: result.email,
                    name: result.firstName,
                    type: result.type,
                  },
                ],
              });
              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "cloudposmailer@gmail.com",
                  pass: "qa1ws23ed", // naturally, replace both with your real credentials or an application-specific password
                },
              });

              const mailOptions = {
                from: "Verification<vindication@enron.com>",
                to: result.email,
                subject: "Your Email Verification Code for SignTalk",
                html: `Verification code is ${result.vcode}.
                <br> <a href ="http://localhost:7080/Register/user/verify?email=${result.email}&vcode=${result.vcode}">Click here to Verify your email</a>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            });
          }
        });
      }
    });
});
router.post("/interpreter", (req, res) => {
  Interpretor.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email Id exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
          } else {
            var lang = []
            if(req.body.language) { lang = req.body.language.split(",") } 
            const interpretor = new Interpretor({
              email: req.body.email,
              password: hash,
              status: "inactive",
              name: req.body.name,
              vcode: Math.floor(100000 + Math.random() * 900000),
            });

            interpretor.save((err, result) => {
              if (err) return res.status(500).json({ message: err.message });
              console.log(result);
              res.status(200).json({
                message: "Please Verify your email to Continue",
                details: [
                  {
                    vcode: result.vcode,
                    email: result.email,
                    name: result.name,
                  },
                ],
              });

              const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                  user: "cloudposmailer@gmail.com",
                  pass: "qa1ws23ed", // naturally, replace both with your real credentials or an application-specific password
                },
              });

              const mailOptions = {
                from: "Verification<vindication@enron.com>",
                to: result.email,
                subject: "Your Email Verification Code for SignTalk",
                html: `Verification code is ${result.vcode}.
                <br> <a href ="http://localhost:7080/Register/interpretor/verify?email=${result.email}&vcode=${result.vcode}">Click here to Verify your email</a>`,
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent: " + info.response);
                }
              });
            });
          }
        });
      }
    });
});
router.get("/interpretor/verify", (req, res) => {
  console.log("hji");
  const email = req.query.email;
  console.log(email)
  const vcode = req.query.vcode;
  Interpretor.findOne({ email: email })
    .exec()
    .then((result) => {
      console.log(result)
      if (!result)
        return res.status(401).json({ message: "email doesnt exist" });

      if (result.vcode == vcode) {
        result.status = "active";
        result.save((err, message) => {
          if (err)
            return res
              .status(401)
              .json({ message: "unable to set status", error: err });
        });
        return res
          .status(200)
          .json({ message: "Email verification Successful for", email });
        console.log("Email verified");
      } else {
        return res.status(401).json({
          message: "Email verification failed",
          error: "Incorrect otp",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Some issue occurred Please retry",
        error: err.message,
      });
    });
});
router.get("/user/verify", (req, res) => {
  console.log("hji");
  const email = req.query.email;
  const vcode = req.query.vcode;
  User.findOne({ email: email })
    .exec()
    .then((result) => {
      if (!result)
        return res.status(401).json({ message: "email doesnt exist" });

      if (result.vcode == vcode) {
        result.status = "active";
        result.save((err, message) => {
          if (err)
            return res
              .status(401)
              .json({ message: "unable to set status", error: err });
        });
        return res
          .status(200)
          .json({ message: "Email verification Successful for", email });
        console.log("Email verified");
      } else {
        return res.status(401).json({
          message: "Email verification failed",
          error: "Incorrect otp",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Some issue occurred Please retry",
        error: err.message,
      });
    });
});
router.get("/", (req, res) => {
  User.find({ email: req.body.email }).exec(function (err, data) {
    if (err) return res.json(err);
    console.log(data[0].email, data[0].password);
  });
});

module.exports = router;
