const usersDB = {
  users: require("../model/users.json"),
  setUsers: function name(data) {
    this.users = data;
  },
};
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogin = async (req, res) => {
  const { password, username } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please enter username and password" });
  }
  const foundUser = usersDB.users.find((user) => user.username === username);
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
    // save refresh token with current user in DB
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.resolve(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    // send refresh token through cookie
    res.cookie("token", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // send access token
    return res.status(201).json({ accessToken });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = handleLogin;
