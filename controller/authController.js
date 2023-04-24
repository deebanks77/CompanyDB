const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  // Find user in the MongoDB
  const foundUser = await User.findOne({ username }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  //   evaluate password
  const match = bcrypt.compare(password, foundUser.password);

  if (match) {
    // create access and refresh Json web token
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: Object.values(foundUser.roles),
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // save refresh token with current user in MongoDB
    const result = await User.findOneAndUpdate(
      { username: foundUser.username },
      {
        username: foundUser.username,
        password: foundUser.password,
        roles: foundUser.roles,
        refreshToken: refreshToken,
      },
      { new: true, runValidators: true }
    );

    // console.log(result);
    // send refresh token through cookie
    res
      .cookie("token", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ accessToken });
    // send access token
    // return res.
  } else {
    return res.sendStatus(401);
  }
};

module.exports = handleLogin;
