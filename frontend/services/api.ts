const API_URL = "http://localhost:5000";

/* ---------- HEALTH ---------- */
export const healthCheck = async () => {
  const res = await fetch(`${API_URL}/api/health`);
  return res.json();
};

/* ---------- AUTH ---------- */
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const signupUser = async (
  name: string,
  email: string,
  password: string
) => {
  const res = await fetch(`${API_URL}/api/auth/register`, { // ✅ FIXED
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }) // ✅ FIXED
  });
  return res.json();
};

/* ---------- CONTACT ---------- */
export const sendContact = async (data: any) => {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
};
