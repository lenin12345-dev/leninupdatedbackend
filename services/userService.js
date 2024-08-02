const User = require("../models/user");
const jwt = require("jsonwebtoken");

const findUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found with id : ", userId);
    }
    return user;
  } catch (error) {
    console.log("error :------- ", error.message);
    throw new Error(error.message);
  }
};
const getUserProfileByToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const { UserInfo } = decodedToken;

    const user = (await findUserById(UserInfo.id)).populate("addresses");
    user.password = null;

    if (!user) {
      throw new Error("user not exist with id : ", userId);
    }
    return user;
  } catch (error) {
    console.log("error ----- ", error.message);
    throw new Error(error.message);
  }
};
const getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    console.log("error - ", error);
    throw new Error(error.message);
  }
};

module.exports = {
  findUserById,
  getUserProfileByToken,
  getAllUsers,
};
