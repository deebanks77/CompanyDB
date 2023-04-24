const usersDB = {
  users: require("../model/users.json"),
  setUsers: function name(data) {
    this.users = data;
  },
};

const fsPromises = require("fs/promises");
const path = require("path");

const logoutController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.token) {
    return res.sendStatus(401); //Unauthorized
  }
  const refreshToken = cookies.token;

  // check if refresh token in DB
  const foundUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("token", { httpOnly: true });
    res.sendStatus(204); //No content
  }

  //   delete refresh token from db
  const otherUsers = usersDB.users.filter(
    (user) => user.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.resolve(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  // send response to client
  res.clearCookie("token", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

module.exports = logoutController;
