import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { AuthState } from "../types";

interface AuthProps {
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}

const Auth: React.FC<AuthProps> = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    height: "",
    gender: "", // No default gender
  });

  // ✅ Strong validation
  const validate = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Strong password validation
    const password = formData.password;
    if (!password) {
      newErrors.password = "Password is required";
    } else {
      const lengthCheck = password.length >= 8;
      const upperCheck = /[A-Z]/.test(password);
      const lowerCheck = /[a-z]/.test(password);
      const numberCheck = /\d/.test(password);
      const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!lengthCheck) newErrors.password = "Password must be at least 8 characters";
      else if (!upperCheck) newErrors.password = "Password must include at least one uppercase letter";
      else if (!lowerCheck) newErrors.password = "Password must include at least one lowercase letter";
      else if (!numberCheck) newErrors.password = "Password must include at least one number";
      else if (!specialCheck) newErrors.password = "Password must include at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return; // Stop if validation fails

    setLoading(true);

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Authentication failed");
        return;
      }

      if (isLogin) {
        setAuth({ user: data.user, isAuthenticated: true });
        navigate("/dashboard");
      } else {
        alert("Signup successful! Please login.");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          age: "",
          height: "",
          gender: "",
        });
      }
    } catch (error) {
      console.error("AUTH ERROR:", error);
      alert("Server error. Check backend console.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-center text-4xl font-black text-slate-900">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl rounded-3xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <input
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full p-4 rounded-xl border"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full p-4 rounded-xl border"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full p-4 rounded-xl border"
                value={formData.password}
                onChange={handleInputChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="age"
                    type="number"
                    placeholder="Age"
                    className="p-3 border rounded-xl"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                  <input
                    name="height"
                    type="number"
                    placeholder="Height"
                    className="p-3 border rounded-xl"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="mt-4">
                  <label className="block mb-1 font-semibold">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-xl"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white bg-blue-600 font-bold disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 font-bold"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
