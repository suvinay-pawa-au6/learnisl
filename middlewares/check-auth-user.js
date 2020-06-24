const jwt = require("jsonwebtoken");
//authentication by decoding jwt token.

module.exports = (req, res, next) => {
  var token = req.body.token;
  jwt.verify(token, "iuyiuweyiuyhewrf8743", (err, data) => {
    if (err)
      return res.status(401).json({
        message: "token is invalid please login",
      });
    else {
      if (data.firstname) {
        req.user = data;
        console.log("successful login");
        next();
      } else {
        return res.status(401).json({
          message: "You dont have access to this page",
        });
      }
    }
  });
};
