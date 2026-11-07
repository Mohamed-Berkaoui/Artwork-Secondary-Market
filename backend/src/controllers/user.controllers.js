const User = require("../models/user.model");
const FailRes = require("../views/Fail");
const bcrypt = require("bcrypt");
const SuccessRes = require("../views/Success");
const jwt = require("jsonwebtoken");
async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json(new FailRes("name,email and password are required"));
  }

  const existUser = await User.findOne({ email: email });

  if (existUser) {
    return res.json(new FailRes("email allready used"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = await User.insertOne({
    name,
    email,
    password: hashedPassword,
  });

  res.json(new SuccessRes(newUser, 201));
}

async function login(req, res) {
  const { email, password } = req.body; //avoid no sql injection

  const existUser = await User.findOne({ email });
  if (!existUser) {
    return res.json(new FailRes("invalid credintials"));
  }

  const isValidPassword = bcrypt.compareSync(password, existUser.password);

  if (!isValidPassword) {
    return res.json(new FailRes("invalid credintials"));
  }

  const token = jwt.sign({ id: existUser._id }, process.env.JWTPASS, {
    expiresIn: "8h",
  });

  res.json(new SuccessRes(token));
}

async function getMe(req, res) {
  const user = await User.findOne({ _id: req.user });

  res.json(new SuccessRes(user));
}

module.exports = { register, login ,getMe};
