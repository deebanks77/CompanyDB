const usersDB = {
  users: require("../model/users.json"),
  setUsers: function name(data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    return res.sendStatus(401); //Unauthorized
  }
  // console.log(cookies);
  const refreshToken = cookies.token;
  //   check if user token exist
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) return res.sendStatus(403); //Forbiden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || decoded.username !== foundUser.username)
      return res.sendStatus(403); //Forbiden
    // user roles
    const roles = Object.values(foundUser.roles);
    // generate new access token
    const accessToken = jwt.sign(
      { UserInfo: { username: decoded.username, roles: roles } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    return res.json({ accessToken });
  });
};

module.exports = handleRefreshToken;
