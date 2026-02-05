// app/admin/users/page.jsx
import UserManagement from "@/components/Admin/UserManagement";
import { fetchUsersAdminAction } from "@/actions/adminUsers";

// Force server-side rendering to access cookies safely
export const dynamic = "force-dynamic";

const Page = async () => {
  try {
    // Fetch users using the centralized action
    const users = await fetchUsersAdminAction();

    // Render the UserManagement component with fetched data
    return <UserManagement allUsersData={users} />;
  } catch (error) {
    console.error("Fetch error:", error);
    return (
      <div className="text-red-500 p-4">
        Error fetching users: {error.message}
      </div>
    );
  }
};

export default Page;
