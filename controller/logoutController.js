const User = require("../model/User");

const fsPromises = require("fs/promises");
const path = require("path");

const logoutController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    return res.sendStatus(401); //Unauthorized
  }
  const refreshToken = cookies.token;

  // check if refresh token in DB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("token", { httpOnly: true });
    res.sendStatus(204); //No content
  }
  //   delete refresh token from db
  const user = await User.findOneAndUpdate(
    { refreshToken },
    {
      username: foundUser.username,
      roles: foundUser.roles,
      password: foundUser.password,
      refreshToken: "",
    }
  );
  // send response to client
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = logoutController;
