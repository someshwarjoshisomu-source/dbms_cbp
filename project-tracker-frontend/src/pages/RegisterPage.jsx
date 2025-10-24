import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
    const [role, setRole] = useState("student");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/register/${role}`, { firstName, lastName, email, password, department });
            setMessage("✅ Registration successful!");
            setTimeout(() => navigate(`/login?role=${role}`), 1500);
        } catch {
            setMessage("❌ Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] font-sans">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 w-[450px] text-white">
                <h2 className="text-3xl font-bold text-center mb-4">Create Account</h2>
                <p className="text-gray-300 text-center mb-6">Choose your role and fill in your details</p>

                <div className="flex justify-center gap-3 mb-6">
                    {["student", "mentor", "company"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRole(r)}
                            className={`px-5 py-2 rounded-xl font-semibold transition-all ${
                                role === r
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                            }`}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-1/2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-1/2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            required
                        />
                    </div>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Department / Company Name"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-600 hover:to-indigo-600 transition-all shadow-lg"
                    >
                        Register
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
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-400 hover:underline font-semibold">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}
