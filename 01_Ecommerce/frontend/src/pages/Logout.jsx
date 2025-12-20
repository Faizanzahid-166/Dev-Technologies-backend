import { logoutUser } from "../api/urls.js";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("user"); // remove stored user
      window.location.href = "/login"; // redirect
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
