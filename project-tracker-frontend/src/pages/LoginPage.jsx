import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const r = searchParams.get("role");
        if (r && ["student", "mentor", "company"].includes(r.toLowerCase())) {
            setRole(r.toLowerCase());
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await api.post(`/auth/login/${role}`, { email, password });
            const data = res.data;

            if (role === "student") localStorage.setItem("pt_id", data.studentId);
            else if (role === "mentor") localStorage.setItem("pt_id", data.mentorId);
            else if (role === "company") localStorage.setItem("pt_id", data.companyId);

            localStorage.setItem("pt_name", data.name);
            localStorage.setItem("pt_email", data.email);
            localStorage.setItem("pt_role", data.role);
            localStorage.setItem("pt_token", data.token);

            setMessage("✅ Sign in successful! Redirecting...");
            setTimeout(() => {
                if (role === "student") navigate("/student");
                else if (role === "mentor") navigate("/mentor");
                else if (role === "company") navigate("/company");
            }, 800);
        } catch (err) {
            let errMsg = err.response?.data?.error || err.response?.data?.message;
            if (!errMsg) {
                if (err.message === "Network Error" || !err.response) {
                    errMsg = "❌ Network / CORS Error: Cannot connect to backend server.";
                } else {
                    errMsg = "❌ Invalid email or password";
                }
            }
            setMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#202124] font-sans p-6">
            <div className="bg-white border border-[#DADCE0] rounded-3xl p-8 sm:p-10 w-full max-w-[420px] shadow-sm">
                {/* Google-like Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FA6400] to-[#FFB300] text-white font-bold text-xl shadow-sm mb-4">
                        🌅
                    </Link>
                    <h2 className="text-2xl font-medium text-[#202124]">Sign in</h2>
                    <p className="text-sm text-[#5F6368] mt-1">to access your {role} portal</p>
                </div>

                {/* Role Tabs (Pill Capsules) */}
                <div className="flex justify-center gap-1.5 p-1 bg-[#F1F3F4] rounded-full mb-4">
                    {["student", "mentor", "company"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => {
                                setRole(r);
                                setMessage("");
                            }}
                            className={`flex-1 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                                role === r
                                    ? "bg-white text-[#FA6400] shadow-sm font-semibold"
                                    : "text-[#5F6368] hover:text-[#202124]"
                            }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {/* ⚡ Use Demo Credentials Button */}
                <div className="mb-5">
                    <button
                        type="button"
                        onClick={() => {
                            if (role === "student") {
                                setEmail("demo.student@google.com");
                                setPassword("Password@123");
                            } else if (role === "mentor") {
                                setEmail("demo.mentor@google.com");
                                setPassword("Password@123");
                            } else {
                                setEmail("demo.company@google.com");
                                setPassword("Password@123");
                            }
                            setMessage(`✅ Loaded demo credentials for ${role.toUpperCase()}! Click "Sign in" below.`);
                        }}
                        className="w-full btn-google-outlined text-xs py-2.5 px-4 font-semibold border-[#FA6400] text-[#FA6400] bg-[#FFF0D4]/50 hover:bg-[#FFF0D4] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                        <span>⚡</span>
                        <span>Use Demo Credentials ({role.toUpperCase()})</span>
                    </button>
                    
                    <div className="flex justify-between items-center mt-2 px-1 text-[11px] text-[#5F6368]">
                        <span>Switch role demo:</span>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("student");
                                    setEmail("demo.student@google.com");
                                    setPassword("Password@123");
                                    setMessage("✅ Loaded Student demo credentials!");
                                }}
                                className="underline hover:text-[#FA6400] cursor-pointer"
                            >
                                Student
                            </button>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("mentor");
                                    setEmail("demo.mentor@google.com");
                                    setPassword("Password@123");
                                    setMessage("✅ Loaded Mentor demo credentials!");
                                }}
                                className="underline hover:text-[#FFB300] cursor-pointer"
                            >
                                Mentor
                            </button>
                            <span>•</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setRole("company");
                                    setEmail("demo.company@google.com");
                                    setPassword("Password@123");
                                    setMessage("✅ Loaded Company demo credentials!");
                                }}
                                className="underline hover:text-[#FA6400] cursor-pointer"
                            >
                                Company
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#5F6368] mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="username@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#5F6368] mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-google-primary py-2.5 text-sm mt-2 disabled:opacity-50"
                    >
                        {loading ? "Authenticating..." : "Sign in"}
                    </button>

                    {message && (
                        <p
                            className={`text-center text-xs font-medium pt-2 ${
                                message.includes("✅") ? "text-green-600" : "text-red-600"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>

                <div className="mt-8 pt-6 border-t border-[#F1F3F4] text-center text-xs text-[#5F6368]">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-[#FA6400] font-semibold hover:underline">
                        Create account
                    </Link>
                </div>
            </div>
        </div>
    );
}
