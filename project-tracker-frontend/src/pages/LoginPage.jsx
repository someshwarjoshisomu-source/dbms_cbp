import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // ✅ Detect role (student, mentor, or company) from query params
    useEffect(() => {
        const r = searchParams.get("role");
        setRole(r || "student");
    }, [searchParams]);

    // ✅ Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/login/${role}`, { email, password });

            // ✅ Extract data from backend response
            const data = res.data;

            // ✅ Save user info in localStorage
            if (role === "student") {
                localStorage.setItem("pt_id", data.studentId);
            } else if (role === "mentor") {
                localStorage.setItem("pt_id", data.mentorId);
            } else if (role === "company") {
                localStorage.setItem("pt_id", data.companyId);
            }

            localStorage.setItem("pt_name", data.name);
            localStorage.setItem("pt_email", data.email);
            localStorage.setItem("pt_role", data.role);
            localStorage.setItem("pt_token", data.token);

            // ✅ Show success message
            setMessage(data.message || "✅ Login Successful");

            // ✅ Redirect to correct dashboard after short delay
            setTimeout(() => {
                if (role === "student") navigate("/student");
                else if (role === "mentor") navigate("/mentor");
                else if (role === "company") navigate("/company");
            }, 1000);
        } catch (err) {
            console.error("Login error:", err);
            setMessage("❌ Invalid credentials");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] font-sans">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-[400px] text-white">
                <h2 className="text-3xl font-bold text-center mb-4 capitalize">{role} Login</h2>
                <p className="text-gray-300 text-center mb-8">Welcome back 👋 Log in to your dashboard</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-300">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-300">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                    >
                        Login
                    </button>

                    {message && (
                        <p
                            className={`text-center mt-3 text-sm ${
                                message.includes("✅") ? "text-green-400" : "text-red-400"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>

                <p className="text-center text-gray-300 mt-8 text-sm">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-indigo-400 hover:underline font-semibold">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    );
}
