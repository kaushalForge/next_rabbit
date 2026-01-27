// /protectedRoutes/protectAdmin.js
export async function protectAdmin(user) {
  if (!user || !user.role) {
    return { success: false, message: "User not provided or role missing" };
  }

  if (user.role !== "admin") {
    return { success: false, message: "Unauthorized: Admins only" };
  }

  return { success: true, user };
}
