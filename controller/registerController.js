const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register new user controller
const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  // check if username exist on database
  const duplicate = await User.findOne({ username }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Username is not available" });
  }

  try {
    // hash the password
    const hashPassword = await bcrypt.hash(password, 10);
    // create role for user
    const roles = { User: 1271 };

    // generate access and refresh token for user
    const accessToken = jwt.sign(
      { UserInfo: { username, roles: Object.values(roles) } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2m" }
    );
    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    // Create a new user in MongoDB
    const result = await User.create({
      username: username,
      roles: roles,
      password: hashPassword,
      refreshToken: refreshToken,
    });
    // send response to client
    res
      .cookie("token", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(201)
      .json({ accessToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = handleNewUser;
