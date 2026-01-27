// src/lib/auth/handleAuthUser.js
import User from "@/models/user";

export const handleAuthUser = async ({
  email,
  name,
  avatar,
  provider,
  providerId,
}) => {
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      email,
      name,
      avatar,
      provider,
      providerId,
    });
  }

  return user;
};
