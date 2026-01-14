const { UserRepository } = require("../repositories");
const UserRepo = new UserRepository();

async function signup(data) {
  try {
    const user = await UserRepo.create(data);
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signup,
};
