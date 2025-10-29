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
const getRecentUsers = async(page,limit)=>{
  const skip = (page - 1) * limit;

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments();

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users: recentUsers,
    totalPages,
    currentPage: page,
    totalUsers,
  };
}

module.exports = {
  findUserById,
  getUserProfileByToken,
  getAllUsers,
  getRecentUsers
};
