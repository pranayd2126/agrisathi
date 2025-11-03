import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://agrisathi-fjls.onrender.com/api";

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [view, setView] = useState("signup"); // signup / signin
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    crop: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${API_URL}/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        answers: {
          crop: form.crop,
          q1: form.q1,
          q2: form.q2,
          q3: form.q3,
          q4: form.q4,
        },
      });
      localStorage.setItem("token", res.data.token);
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Signup error");
    }
  };

  const handleSignin = async () => {
    try {
      const res = await axios.post(`${API_URL}/signin`, {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem("token", res.data.token);
      onAuthSuccess(res.data.user);
      onClose();
    } catch (err) {
      alert(err.response?.data?.error || "Signin error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <button className="float-right" onClick={onClose}>
          X
        </button>
        <h2 className="text-xl font-bold mb-4">
          {view === "signup" ? "Signup" : "Signin"}
        </h2>
        {view === "signup" && (
          <>
            <input
              placeholder="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <h4 className="font-semibold mt-2">Answer 5 Questions</h4>
            <input
              placeholder="Crop (mandatory)"
              name="crop"
              value={form.crop}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Q1"
              name="q1"
              value={form.q1}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Q2"
              name="q2"
              value={form.q2}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Q3"
              name="q3"
              value={form.q3}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Q4"
              name="q4"
              value={form.q4}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <button
              onClick={handleSignup}
              className="bg-green-500 text-white p-2 rounded w-full mt-2"
            >
              Signup
            </button>
            <p className="mt-2 text-center">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setView("signin")}
              >
                Signin
              </span>
            </p>
          </>
        )}
        {view === "signin" && (
          <>
            <input
              placeholder="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              placeholder="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mb-2 w-full p-2 border rounded"
            />
            <button
              onClick={handleSignin}
              className="bg-blue-500 text-white p-2 rounded w-full mt-2"
            >
              Signin
            </button>
            <p className="mt-2 text-center">
              New user?{" "}
              <span
                className="text-green-500 cursor-pointer"
                onClick={() => setView("signup")}
              >
                Signup
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
