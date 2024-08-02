const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cartService = require("../services/cartService.js");
const userService = require("../services/userService.js");

exports.userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    const user = await User.findOne({ email: email }).exec();
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { username: user.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send authorization roles and access token to user
    res.json({ accessToken, message: "Login Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.userSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res
        .status(400)
        .json({ message: "Please fill up the required credentials" });
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) {
      res.status(401).json({ message: "user already exists" });
    }
    // Generate a base username
    let initialUsername = `${firstName}${lastName.charAt(0)}`.toLowerCase();
    let username = initialUsername;

    // Ensure the username is unique
    let userExists = await User.findOne({ username }).exec();
    let counter = 1;
    while (userExists) {
      username = `${initialUsername}${counter}`;
      userExists = await User.findOne({ username }).exec();
      counter++;
    }
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname:firstName,
      lastname:lastName,
      username,
      email,
      password: hashedPwd,
      phone,
    });
    await newUser.save();
    await cartService.createCart(newUser);
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    const user = await userService.getUserProfileByToken(token);

    return res.status(200).send(user);
  } catch (error) {
    console.log("error from controller - ", error);
    return res.status(500).send({ error: error.message });
  }
};

exports. getAllUsers=async(req,res)=>{
  try {
      const users=await userService.getAllUsers()
      return res.status(200).send(users)
  } catch (error) {
      return res.status(500).send({error:error.message})
  }
}
