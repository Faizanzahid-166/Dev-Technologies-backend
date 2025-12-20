import api from "./axiosConfig.js"; // ensure default export

// Login
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.data.token) {
    localStorage.setItem("token", res.data.token); // save JWT
    localStorage.setItem("user", JSON.stringify(res.data.user)); // save user info
  }

  return res.data;
};

// Register
export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

// Update profile
export const updateProfileApi = async (updates) => {
  const res = await api.put("/profile/me", updates);
  localStorage.setItem("user", JSON.stringify(res.data));
  return res.data;
};

// List all users (protected)
export const listUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token found");
  return await api.get("/profile/users");
};


