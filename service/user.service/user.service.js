import UserModel from "../../models/user.model.js";

const UserService = {
  FindUserByEmail: async (email) => {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error?.message || "Find user failed");
    }
  },
};

export default UserService;