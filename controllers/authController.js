const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "username and password is mandatory" });
  }
  const foundUser = userDB.users.find(person => person.username === user);

  if (!foundUser) {
    console.log("Not Found User")
    return res.sendStatus(401);
  }

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    // create JWT Here
    res.json({ success: `User ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
