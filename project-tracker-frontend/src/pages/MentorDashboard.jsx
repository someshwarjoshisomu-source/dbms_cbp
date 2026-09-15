import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { UserGroupIcon, DocumentTextIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function MentorDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");
    const navigate = useNavigate();
    const mentorId = localStorage.getItem("pt_id");
    const mentorName = localStorage.getItem("pt_name") || "Mentor";

    useEffect(() => {
        if (!mentorId) {
            navigate("/login?role=mentor");
        }
    }, [mentorId, navigate]);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get("/mentors/applications");
                setApplications(res.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/mentors/applications/${id}/status?status=${status}`);
            alert(`✅ Application ${id} marked as ${status}`);
            setApplications((prev) =>
                prev.map((a) =>
                    a.applicationId === id ? { ...a, status } : a
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Failed to update status.");
        }
    };

    const handleEvaluation = async (app) => {
        if (!app._marks || !app._maxMarks) {
            alert("⚠️ Please enter marks obtained and maximum marks.");
            return;
        }

        const payload = {
            student: { studentId: app.student?.studentId },
            mentor: { mentorId: parseInt(mentorId) },
            marksObtained: parseFloat(app._marks),
            maxMarks: parseFloat(app._maxMarks),
            remarks: app._remarks || "",
        };

        try {
            const res = await api.post("/evaluations", payload);
            alert(res.data.message || "✅ Evaluation recorded successfully!");
        } catch (error) {
            console.error("Error submitting evaluation:", error);
            alert("❌ Failed to save evaluation.");
        }
    };

    const getStatusPill = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
            case "offered":
                return <span className="status-pill-offered">● {status}</span>;
            case "rejected":
                return <span className="status-pill-rejected">● {status}</span>;
            case "interviewing":
                return <span className="status-pill-interviewing">● {status}</span>;
            default:
                return <span className="status-pill-applied">● {status || "Applied"}</span>;
        }
    };

    const getFullResumeUrl = (url) => {
        if (!url) return "#";
        if (url.startsWith("http")) return url;
        const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const filteredApps = applications.filter((app) => {
        if (activeTab === "accepted") return app.status?.toLowerCase() === "accepted";
        if (activeTab === "pending") return !app.status || app.status?.toLowerCase() === "applied" || app.status?.toLowerCase() === "pending";
        return true;
    });

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans pb-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Greeting Card */}
                <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#FFB300]">
                            Faculty Mentor Portal
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-medium text-[#202124] mt-1">
                            Welcome, {mentorName} 👋
                        </h1>
                        <p className="text-sm text-[#5F6368] mt-1">
                            Review campus internship applications, verify student submissions, and submit academic assessments.
                        </p>
                    </div>

                    <div className="flex gap-2 p-1 bg-[#F1F3F4] rounded-full">
                        {["all", "pending", "accepted"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                                    activeTab === tab
                                        ? "bg-white text-[#FA6400] shadow-sm font-semibold"
                                        : "text-[#5F6368] hover:text-[#202124]"
                                }`}
                            >
                                {tab} ({applications.filter(a => tab === "all" ? true : tab === "accepted" ? a.status?.toLowerCase() === "accepted" : (a.status?.toLowerCase() === "applied" || !a.status)).length})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Applications Grid */}
                <h2 className="text-xl font-medium text-[#202124] flex items-center gap-2 mb-6">
                    <UserGroupIcon className="w-5 h-5 text-[#FA6400]" /> Student Submissions for Review
                </h2>

                {loading ? (
                    <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                        Loading student records...
                    </div>
                ) : filteredApps.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                        No applications in this view.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredApps.map((app) => (
                            <div
                                key={app.applicationId}
                                className="google-card p-6 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <h3 className="text-base font-semibold text-[#202124] line-clamp-1">
                                            {app.internship?.title || "Internship Role"}
                                        </h3>
                                        {getStatusPill(app.status)}
                                    </div>

                                    <div className="bg-[#F8F9FA] border border-[#F1F3F4] rounded-xl p-3 my-3">
                                        <div className="font-medium text-xs text-[#202124]">
                                            👤 {app.student ? `${app.student.firstName} ${app.student.lastName}` : `Student ID #${app.student?.studentId}`}
                                        </div>
                                        <div className="text-[11px] text-[#5F6368] mt-0.5">
                                            ✉️ {app.student?.email || "No email available"}
                                        </div>
                                        {app.student?.major && (
                                            <div className="text-[11px] text-[#5F6368] mt-0.5">
                                                🎓 {app.student.major} ({app.student.graduationYear || "N/A"})
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-[#5F6368] mb-4">
                                        <span>Applied: {new Date(app.applicationDate).toLocaleDateString()}</span>
                                        {app.resumeUrl ? (
                                            <a
                                                href={getFullResumeUrl(app.resumeUrl)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#FA6400] font-semibold hover:underline flex items-center gap-1"
                                            >
                                                📄 Resume ↗
                                            </a>
                                        ) : (
                                            <span className="text-[#80868B]">No resume</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-3 border-t border-[#F1F3F4]">
                                        <button
                                            onClick={() => handleStatusChange(app.applicationId, "Accepted")}
                                            className="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#137333] hover:bg-[#CEEAD6] transition-all flex items-center justify-center gap-1"
                                        >
                                            <CheckIcon className="w-3.5 h-3.5" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange(app.applicationId, "Rejected")}
                                            className="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold bg-[#FCE8E6] text-[#C5221F] hover:bg-[#FAD2CF] transition-all flex items-center justify-center gap-1"
                                        >
                                            <XMarkIcon className="w-3.5 h-3.5" /> Reject
                                        </button>
                                    </div>

                                    {/* Inline Evaluation Form */}
                                    {app.status?.toLowerCase() === "accepted" && (
                                        <div className="mt-4 pt-4 border-t border-[#F1F3F4]">
                                            <h4 className="text-xs font-semibold text-[#202124] mb-2">
                                                Grade & Evaluate Performance
                                            </h4>
                                            <div className="flex gap-2 mb-2">
                                                <input
                                                    type="number"
                                                    placeholder="Marks"
                                                    onChange={(e) => (app._marks = e.target.value)}
                                                    className="w-1/2 px-3 py-1.5 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:border-[#FA6400] focus:outline-none"
                                                />
                                                <input
                                                    type="number"
                                                    placeholder="Max Marks"
                                                    onChange={(e) => (app._maxMarks = e.target.value)}
                                                    className="w-1/2 px-3 py-1.5 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:border-[#FA6400] focus:outline-none"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Faculty comments & feedback..."
                                                onChange={(e) => (app._remarks = e.target.value)}
                                                rows="2"
                                                className="w-full px-3 py-1.5 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:border-[#FA6400] focus:outline-none mb-2"
                                            ></textarea>
                                            <button
                                                onClick={() => handleEvaluation(app)}
                                                className="w-full btn-google-primary text-xs py-1.5"
                                            >
                                                Submit Academic Evaluation
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
