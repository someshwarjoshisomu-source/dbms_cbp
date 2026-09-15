import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { BriefcaseIcon, DocumentTextIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function StudentDashboard() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedInternships, setAppliedInternships] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState({});
    const [applyingId, setApplyingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const studentId = localStorage.getItem("pt_id");
    const name = localStorage.getItem("pt_name");

    useEffect(() => {
        if (!studentId) {
            navigate("/login?role=student");
        }
    }, [studentId, navigate]);

    // Fetch internships
    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.get("/internships");
                setInternships(res.data);
            } catch (error) {
                console.error("Error fetching internships:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    // Fetch applications
    useEffect(() => {
        const fetchApplied = async () => {
            try {
                const res = await api.get(`/applications/student/${studentId}`);
                setMyApplications(res.data);
                const mapped = res.data.map((a) => ({
                    internshipId: a.internship ? a.internship.internshipId : null,
                    status: a.status,
                }));
                setAppliedInternships(mapped);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };
        if (studentId) fetchApplied();
    }, [studentId]);

    // Fetch evaluations
    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const res = await api.get(`/evaluations/student/${studentId}`);
                setEvaluations(res.data);
            } catch (error) {
                console.error("Error fetching evaluations:", error);
            }
        };
        if (studentId) fetchEvaluations();
    }, [studentId]);

    const handleFileSelect = (internshipId, file) => {
        setSelectedFiles((prev) => ({ ...prev, [internshipId]: file }));
    };

    const handleApply = async (internshipId) => {
        const file = selectedFiles[internshipId];
        if (!file) {
            alert("⚠️ Please select your resume (PDF/DOCX) before submitting.");
            return;
        }

        setApplyingId(internshipId);
        try {
            let resumeUrl = "";

            const formData = new FormData();
            formData.append("file", file);
            const uploadRes = await api.post("/upload/resume", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            resumeUrl = uploadRes.data?.url || (typeof uploadRes.data === "string" ? JSON.parse(uploadRes.data).url : "");

            const payload = {
                student: { studentId: parseInt(studentId) },
                internship: { internshipId },
                resumeUrl,
            };

            await api.post("/applications", payload);
            alert("✅ Application submitted successfully!");

            setAppliedInternships((prev) => [
                ...prev,
                { internshipId, status: "Applied" },
            ]);

            // Refresh applications
            const updated = await api.get(`/applications/student/${studentId}`);
            setMyApplications(updated.data);

            setSelectedFiles((prev) => {
                const copy = { ...prev };
                delete copy[internshipId];
                return copy;
            });
        } catch (error) {
            console.error("Error applying:", error);
            const msg = error.response?.data?.error || error.response?.data?.message || "Could not apply for internship.";
            alert("❌ " + msg);
        } finally {
            setApplyingId(null);
        }
    };

    const getStatusPill = (status) => {
        switch (status?.toLowerCase()) {
            case "accepted":
            case "offered":
                return <span className="status-pill-offered">● {status}</span>;
            case "interviewing":
                return <span className="status-pill-interviewing">● {status}</span>;
            case "rejected":
                return <span className="status-pill-rejected">● {status}</span>;
            case "applied":
                return <span className="status-pill-applied">● {status}</span>;
            default:
                return <span className="status-pill-pending">● {status || "Pending"}</span>;
        }
    };

    const getFullResumeUrl = (url) => {
        if (!url) return "#";
        if (url.startsWith("http")) return url;
        const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
        return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
    };

    const filteredInternships = internships.filter((i) =>
        i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans pb-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero / Greeting */}
                <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#FA6400]">
                            Student Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-medium text-[#202124] mt-1">
                            Welcome back, {name || "Student"} 👋
                        </h1>
                        <p className="text-sm text-[#5F6368] mt-1">
                            Explore active corporate listings, track application statuses, and review faculty evaluations.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <a href="#applications" className="btn-google-outlined text-xs py-2 px-4">
                            My Applications ({myApplications.length})
                        </a>
                        <a href="#evaluations" className="btn-google-outlined text-xs py-2 px-4">
                            Evaluations ({evaluations.length})
                        </a>
                    </div>
                </div>

                {/* Section 1: Internships */}
                <div id="internships" className="mb-14">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl font-medium text-[#202124] flex items-center gap-2">
                                <BriefcaseIcon className="w-5 h-5 text-[#FA6400]" /> Available Internships
                            </h2>
                            <p className="text-xs text-[#5F6368] mt-0.5">
                                Verified positions from industry recruiters
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search by role or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-full border border-[#DADCE0] text-xs bg-white text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            Loading internships...
                        </div>
                    ) : filteredInternships.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            No matching internships found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredInternships.map((internship) => {
                                const applied = appliedInternships.find(
                                    (a) => a.internshipId === internship.internshipId
                                );
                                const status = applied?.status || null;
                                const isApplying = applyingId === internship.internshipId;

                                return (
                                    <div
                                        key={internship.internshipId}
                                        className="google-card p-6 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-base font-semibold text-[#202124] line-clamp-1">
                                                    {internship.title}
                                                </h3>
                                                {status && getStatusPill(status)}
                                            </div>

                                            <p className="text-xs font-medium text-[#FA6400] mb-3 flex items-center gap-1">
                                                🏢 {internship.companyName || "Company"}
                                            </p>

                                            <p className="text-xs text-[#5F6368] line-clamp-3 leading-relaxed mb-4">
                                                {internship.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 text-[11px] mb-4">
                                                <span className="bg-[#F1F3F4] text-[#5F6368] px-2.5 py-1 rounded-full font-medium">
                                                    ⏳ {internship.duration || "Duration N/A"}
                                                </span>
                                                <span className="bg-[#FFF0D4] text-[#C26100] px-2.5 py-1 rounded-full font-medium">
                                                    💰 ₹{internship.stipend ? internship.stipend.toLocaleString() : "0"} / mo
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#F1F3F4]">
                                            {status ? (
                                                <div className="text-center py-2 text-xs font-semibold text-[#5F6368] bg-[#F8F9FA] rounded-full">
                                                    Application Submitted ({status})
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <label className="block text-[11px] text-[#5F6368] font-medium">
                                                        Attach Resume (PDF / Word):
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={(e) =>
                                                            handleFileSelect(internship.internshipId, e.target.files[0])
                                                        }
                                                        className="w-full text-xs text-[#5F6368] file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#F1F3F4] file:text-[#202124] hover:file:bg-[#E8EAED]"
                                                    />
                                                    <button
                                                        disabled={isApplying}
                                                        onClick={() => handleApply(internship.internshipId)}
                                                        className="w-full btn-google-primary text-xs py-2 mt-1 disabled:opacity-50"
                                                    >
                                                        {isApplying ? "Submitting..." : "Apply Now"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Section 2: My Applications */}
                <div id="applications" className="mb-14">
                    <h2 className="text-xl font-medium text-[#202124] flex items-center gap-2 mb-4">
                        <DocumentTextIcon className="w-5 h-5 text-[#FA6400]" /> My Application Tracker
                    </h2>

                    {myApplications.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            You have not submitted any applications yet.
                        </div>
                    ) : (
                        <div className="bg-white border border-[#E0E0E0] rounded-2xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-[#F8F9FA] border-b border-[#E0E0E0] text-[#5F6368] font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3.5">Internship Position</th>
                                            <th className="p-3.5">Company</th>
                                            <th className="p-3.5">Date Applied</th>
                                            <th className="p-3.5">Status</th>
                                            <th className="p-3.5 text-right">Resume</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F1F3F4]">
                                        {myApplications.map((app) => (
                                            <tr key={app.applicationId} className="google-table-row">
                                                <td className="p-3.5 font-medium text-[#202124]">
                                                    {app.internship?.title || "Internship"}
                                                </td>
                                                <td className="p-3.5 text-[#5F6368]">
                                                    {app.internship?.company?.companyName || "Corporate Partner"}
                                                </td>
                                                <td className="p-3.5 text-[#5F6368]">
                                                    {new Date(app.applicationDate).toLocaleDateString()}
                                                </td>
                                                <td className="p-3.5">
                                                    {getStatusPill(app.status)}
                                                </td>
                                                <td className="p-3.5 text-right">
                                                    {app.resumeUrl ? (
                                                        <a
                                                            href={getFullResumeUrl(app.resumeUrl)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-[#FA6400] font-semibold hover:underline"
                                                        >
                                                            View Resume ↗
                                                        </a>
                                                    ) : (
                                                        <span className="text-[#80868B]">None</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Evaluations */}
                <div id="evaluations" className="mb-8">
                    <h2 className="text-xl font-medium text-[#202124] flex items-center gap-2 mb-4">
                        <CheckCircleIcon className="w-5 h-5 text-[#FA6400]" /> Faculty Performance Evaluations
                    </h2>

                    {evaluations.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            No evaluations recorded yet. Evaluations will appear after faculty mentor review.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {evaluations.map((evalItem) => (
                                <div key={evalItem.evaluationId} className="google-card p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold text-[#FA6400] uppercase">
                                            Evaluation #{evalItem.evaluationId}
                                        </span>
                                        <span className="text-xs text-[#5F6368]">
                                            {new Date(evalItem.evaluationDate).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-baseline gap-1 my-3">
                                        <span className="text-3xl font-bold text-[#202124]">
                                            {evalItem.marksObtained}
                                        </span>
                                        <span className="text-sm text-[#5F6368]">
                                            / {evalItem.maxMarks} marks
                                        </span>
                                    </div>

                                    <p className="text-xs text-[#5F6368] bg-[#F8F9FA] p-3 rounded-xl border border-[#F1F3F4] leading-relaxed">
                                        <b>Faculty Remarks:</b> {evalItem.remarks || "No remarks specified."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
