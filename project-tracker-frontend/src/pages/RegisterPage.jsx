import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
    const [role, setRole] = useState("student");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        password: "",
        major: "",
        graduationYear: "",
        department: "",
        designation: "",
        contactPerson: "",
        contactNumber: "",
        address: "",
        websiteUrl: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
            };

            if (role === "student") {
                payload.firstName = formData.firstName;
                payload.lastName = formData.lastName;
                payload.major = formData.major;
                payload.graduationYear = formData.graduationYear ? parseInt(formData.graduationYear) : null;
            } else if (role === "mentor") {
                payload.firstName = formData.firstName;
                payload.lastName = formData.lastName;
                payload.department = formData.department;
                payload.designation = formData.designation;
            } else if (role === "company") {
                payload.companyName = formData.companyName;
                payload.contactPerson = formData.contactPerson;
                payload.contactNumber = formData.contactNumber;
                payload.address = formData.address;
                payload.websiteUrl = formData.websiteUrl;
            }

            const res = await api.post(`/auth/register/${role}`, payload);
            const data = res.data;

            if (role === "student") localStorage.setItem("pt_id", data.studentId);
            else if (role === "mentor") localStorage.setItem("pt_id", data.mentorId);
            else if (role === "company") localStorage.setItem("pt_id", data.companyId);

            localStorage.setItem("pt_name", data.name);
            localStorage.setItem("pt_email", data.email);
            localStorage.setItem("pt_role", data.role);
            localStorage.setItem("pt_token", data.token);

            setMessage("✅ Registration successful! Redirecting to portal...");
            setTimeout(() => {
                if (role === "student") navigate("/student");
                else if (role === "mentor") navigate("/mentor");
                else if (role === "company") navigate("/company");
            }, 1000);
        } catch (err) {
            const errMsg = err.response?.data?.error || err.response?.data?.message || "❌ Registration failed";
            setMessage(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] text-[#202124] font-sans p-6">
            <div className="bg-white border border-[#DADCE0] rounded-3xl p-8 sm:p-10 w-full max-w-lg shadow-sm">
                {/* Google-like Header */}
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#FA6400] to-[#FFB300] text-white font-bold text-xl shadow-sm mb-3">
                        🌅
                    </Link>
                    <h2 className="text-2xl font-medium text-[#202124]">Create your account</h2>
                    <p className="text-sm text-[#5F6368] mt-1">Select your role to get started</p>
                </div>

                {/* Role Tabs */}
                <div className="flex justify-center gap-1.5 p-1 bg-[#F1F3F4] rounded-full mb-6">
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

                <form onSubmit={handleRegister} className="space-y-3.5">
                    {role !== "company" ? (
                        <div className="flex gap-3">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Jane"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-[#5F6368] mb-1">Company / Organization Name</label>
                            <input
                                type="text"
                                name="companyName"
                                placeholder="e.g. Google India"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-[#5F6368] mb-1">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your.email@domain.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#5F6368] mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Minimum 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                            required
                            minLength={6}
                        />
                    </div>

                    {role === "student" && (
                        <div className="flex gap-3">
                            <div className="w-2/3">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Major / Discipline</label>
                                <input
                                    type="text"
                                    name="major"
                                    placeholder="Computer Science"
                                    value={formData.major}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Grad Year</label>
                                <input
                                    type="number"
                                    name="graduationYear"
                                    placeholder="2026"
                                    value={formData.graduationYear}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {role === "mentor" && (
                        <div className="flex gap-3">
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Department</label>
                                <input
                                    type="text"
                                    name="department"
                                    placeholder="CS & Engineering"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                            <div className="w-1/2">
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    placeholder="Associate Professor"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {role === "company" && (
                        <>
                            <div className="flex gap-3">
                                <div className="w-1/2">
                                    <label className="block text-xs font-semibold text-[#5F6368] mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        name="contactPerson"
                                        placeholder="Recruiting Lead"
                                        value={formData.contactPerson}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-xs font-semibold text-[#5F6368] mb-1">Phone</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        placeholder="+91 9876543210"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Website URL</label>
                                <input
                                    type="url"
                                    name="websiteUrl"
                                    placeholder="https://company.com"
                                    value={formData.websiteUrl}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-google-primary py-2.5 text-sm mt-3 disabled:opacity-50"
                    >
                        {loading ? "Creating account..." : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
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

                <div className="mt-6 pt-5 border-t border-[#F1F3F4] text-center text-xs text-[#5F6368]">
                    Already registered?{" "}
                    <Link to="/login" className="text-[#FA6400] font-semibold hover:underline">
                        Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
