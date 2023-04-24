const { allowedOrigin } = require("../config/corsOptions");

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigin.includes(origin)) {
    res.header("Access_Control_Allow_Credentials", true);
  }
  next();
};

module.exports = credentials;
