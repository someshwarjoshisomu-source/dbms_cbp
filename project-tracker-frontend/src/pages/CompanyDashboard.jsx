import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon, PlusCircleIcon, UsersIcon, CheckBadgeIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";

export default function CompanyDashboard() {
    const navigate = useNavigate();
    const [internships, setInternships] = useState([]);
    const [analytics, setAnalytics] = useState({});
    const [loading, setLoading] = useState(true);
    const [showApplicants, setShowApplicants] = useState(false);
    const [selectedInternship, setSelectedInternship] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState("");
    const [posting, setPosting] = useState(false);
    const [newInternship, setNewInternship] = useState({
        title: "",
        description: "",
        duration: "",
        stipend: "",
        status: "Active",
    });

    const companyId = localStorage.getItem("pt_id");
    const companyName = localStorage.getItem("pt_name") || "Company";

    useEffect(() => {
        if (!companyId) {
            navigate("/login?role=company");
            return;
        }

        const fetchData = async () => {
            try {
                const [internRes, analyticRes] = await Promise.all([
                    api.get(`/internships/company/${companyId}`),
                    api.get(`/companies/${companyId}/analytics`),
                ]);
                setInternships(internRes.data);
                setAnalytics(analyticRes.data);
            } catch (error) {
                console.error("Error loading company data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [companyId, navigate]);

    const fetchMentors = async () => {
        try {
            const res = await api.get("/mentors");
            setMentors(res.data);
        } catch (error) {
            console.error("Error fetching mentors:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInternship((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setPosting(true);
        try {
            const payload = {
                ...newInternship,
                stipend: parseFloat(newInternship.stipend) || 0,
                company: { companyId: parseInt(companyId) }
            };
            const res = await api.post("/internships", payload);
            alert("✅ Internship posted successfully!");
            setInternships([...internships, res.data]);
            setNewInternship({ title: "", description: "", duration: "", stipend: "", status: "Active" });

            // Refresh analytics
            const aRes = await api.get(`/companies/${companyId}/analytics`);
            setAnalytics(aRes.data);
        } catch (error) {
            console.error("Error creating internship:", error);
            alert("❌ Failed to create internship listing.");
        } finally {
            setPosting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this internship posting?")) return;
        try {
            await api.delete(`/internships/${id}`);
            alert("🗑️ Internship removed successfully!");
            setInternships((prev) => prev.filter((i) => i.internshipId !== id));

            const aRes = await api.get(`/companies/${companyId}/analytics`);
            setAnalytics(aRes.data);
        } catch (error) {
            console.error("Error deleting internship:", error);
            alert("❌ Could not delete internship.");
        }
    };

    const handleViewApplicants = async (internship) => {
        try {
            const res = await api.get(`/applications/internship/${internship.internshipId}`);
            setApplicants(res.data);
            setSelectedInternship(internship);
            setShowApplicants(true);
            await fetchMentors();
        } catch (error) {
            console.error("Error fetching applicants:", error);
            alert("❌ Failed to load applicants.");
        }
    };

    const handleStatusChange = async (applicationId, status) => {
        try {
            await api.put(`/companies/applications/${applicationId}/status?status=${status}`);
            alert(`✅ Application updated to ${status}`);
            setApplicants((prev) =>
                prev.map((app) =>
                    app.applicationId === applicationId ? { ...app, status } : app
                )
            );

            const aRes = await api.get(`/companies/${companyId}/analytics`);
            setAnalytics(aRes.data);
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Failed to update status.");
        }
    };

    const handleAssignMentor = async (studentId) => {
        if (!selectedMentor) {
            alert("Please select a faculty mentor first!");
            return;
        }
        try {
            const res = await api.put(
                `/companies/assign-mentor?mentorId=${selectedMentor}&studentId=${studentId}&internshipId=${selectedInternship?.internshipId || ""}`
            );
            alert("✅ " + (res.data.message || "Mentor assigned successfully!"));
        } catch (error) {
            console.error("Error assigning mentor:", error);
            alert("❌ Failed to assign mentor.");
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

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans pb-16">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Greeting Card */}
                <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#FA6400]">
                            Corporate Recruiting Portal
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-medium text-[#202124] mt-1">
                            {companyName} Dashboard
                        </h1>
                        <p className="text-sm text-[#5F6368] mt-1">
                            Manage campus internship postings, inspect candidate resumes, and assign academic faculty mentors.
                        </p>
                    </div>

                    <a href="#post-internship" className="btn-google-primary text-xs py-2 px-5">
                        <PlusCircleIcon className="w-4 h-4" /> Post New Internship
                    </a>
                </div>

                {/* Metrics Cards (Google Material You) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="google-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF0D4] flex items-center justify-center text-[#FA6400]">
                            <BriefcaseIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-[#5F6368]">Total Openings</span>
                            <div className="text-2xl font-bold text-[#202124]">
                                {analytics?.totalInternships || 0}
                            </div>
                        </div>
                    </div>

                    <div className="google-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E8F0FE] flex items-center justify-center text-[#1A73E8]">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-[#5F6368]">Student Applications</span>
                            <div className="text-2xl font-bold text-[#202124]">
                                {analytics?.totalApplications || 0}
                            </div>
                        </div>
                    </div>

                    <div className="google-card p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F4EA] flex items-center justify-center text-[#137333]">
                            <CheckBadgeIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-[#5F6368]">Accepted Candidates</span>
                            <div className="text-2xl font-bold text-[#202124]">
                                {analytics?.acceptedCount || 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Internship Postings */}
                <div className="mb-14">
                    <h2 className="text-xl font-medium text-[#202124] flex items-center gap-2 mb-6">
                        <BriefcaseIcon className="w-5 h-5 text-[#FA6400]" /> Published Internship Positions
                    </h2>

                    {loading ? (
                        <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            Loading your internship postings...
                        </div>
                    ) : internships.length === 0 ? (
                        <div className="text-center py-16 bg-white border border-[#E0E0E0] rounded-2xl text-[#5F6368] text-sm">
                            No internship openings posted yet. Use the form below to publish one.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {internships.map((i) => (
                                <div key={i.internshipId} className="google-card p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-base font-semibold text-[#202124] line-clamp-1">
                                                {i.title}
                                            </h3>
                                            <span className="status-pill-offered">● {i.status}</span>
                                        </div>

                                        <p className="text-xs text-[#5F6368] line-clamp-3 leading-relaxed mb-4">
                                            {i.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 text-[11px] mb-4">
                                            <span className="bg-[#F1F3F4] text-[#5F6368] px-2.5 py-1 rounded-full font-medium">
                                                ⏳ {i.duration || "Flexible"}
                                            </span>
                                            <span className="bg-[#FFF0D4] text-[#C26100] px-2.5 py-1 rounded-full font-medium">
                                                💰 ₹{i.stipend ? i.stipend.toLocaleString() : "0"} / mo
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t border-[#F1F3F4]">
                                        <button
                                            onClick={() => handleViewApplicants(i)}
                                            className="flex-1 btn-google-outlined text-xs py-1.5"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5" /> Applicants
                                        </button>
                                        <button
                                            onClick={() => handleDelete(i.internshipId)}
                                            className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#C5221F] bg-[#FCE8E6] hover:bg-[#FAD2CF] transition-all"
                                        >
                                            <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Post New Internship Form */}
                <div id="post-internship" className="max-w-2xl mx-auto bg-white border border-[#E0E0E0] rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xl font-medium text-[#202124] mb-1 flex items-center gap-2">
                        <PlusCircleIcon className="w-5 h-5 text-[#FA6400]" /> Post a New Campus Opportunity
                    </h3>
                    <p className="text-xs text-[#5F6368] mb-6">
                        Provide role expectations, stipend details, and timeline for student applicants.
                    </p>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#5F6368] mb-1">Position Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Associate Software Engineer Intern"
                                value={newInternship.title}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#5F6368] mb-1">Role Description & Requirements</label>
                            <textarea
                                name="description"
                                placeholder="Describe project scope, expected skills, and learning outcomes..."
                                value={newInternship.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-4 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    placeholder="e.g. 3 Months (Full-Time)"
                                    value={newInternship.duration}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#5F6368] mb-1">Monthly Stipend (₹)</label>
                                <input
                                    type="number"
                                    name="stipend"
                                    placeholder="e.g. 50000"
                                    value={newInternship.stipend}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 rounded-xl border border-[#DADCE0] text-sm text-[#202124] focus:border-[#FA6400] focus:ring-1 focus:ring-[#FA6400] focus:outline-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={posting}
                            className="w-full btn-google-primary py-2.5 text-sm mt-2 disabled:opacity-50"
                        >
                            {posting ? "Publishing listing..." : "Publish Internship"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Applicants Modal (Google Dialog Style) */}
            {showApplicants && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl border border-[#E0E0E0] max-h-[90vh] flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between pb-4 border-b border-[#E0E0E0] mb-6">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FA6400]">
                                        Candidate Review
                                    </span>
                                    <h2 className="text-xl font-semibold text-[#202124] mt-0.5">
                                        Applicants for {selectedInternship?.title}
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowApplicants(false)}
                                    className="text-xs font-semibold text-[#5F6368] hover:text-[#202124] bg-[#F1F3F4] px-3 py-1.5 rounded-full"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            {applicants.length === 0 ? (
                                <p className="text-[#5F6368] text-center py-12 text-sm">
                                    No student applications submitted for this listing yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto max-h-[50vh] overflow-y-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-[#F8F9FA] text-[#5F6368] font-semibold sticky top-0 border-b border-[#E0E0E0]">
                                            <tr>
                                                <th className="p-3">Applicant Name</th>
                                                <th className="p-3">Status</th>
                                                <th className="p-3">Resume</th>
                                                <th className="p-3 text-center">Recruiter Decision</th>
                                                <th className="p-3">Faculty Mentor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#F1F3F4]">
                                            {applicants.map((app) => {
                                                const { applicationId, student, status, resumeUrl } = app;
                                                return (
                                                    <tr key={applicationId} className="google-table-row">
                                                        <td className="p-3">
                                                            <div className="font-semibold text-[#202124]">
                                                                {student ? `${student.firstName} ${student.lastName}` : `Student #${student?.studentId}`}
                                                            </div>
                                                            <div className="text-[11px] text-[#5F6368]">
                                                                {student?.email}
                                                            </div>
                                                            {student?.major && (
                                                                <div className="text-[11px] text-[#80868B]">
                                                                    {student.major} ({student.graduationYear || "N/A"})
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="p-3">
                                                            {getStatusPill(status)}
                                                        </td>
                                                        <td className="p-3">
                                                            {resumeUrl ? (
                                                                <a
                                                                    href={getFullResumeUrl(resumeUrl)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="text-[#FA6400] font-semibold hover:underline flex items-center gap-1"
                                                                >
                                                                    📄 Resume ↗
                                                                </a>
                                                            ) : (
                                                                <span className="text-[#80868B]">None</span>
                                                            )}
                                                        </td>
                                                        <td className="p-3 text-center">
                                                            <div className="flex justify-center gap-1.5">
                                                                <button
                                                                    onClick={() => handleStatusChange(applicationId, "Accepted")}
                                                                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#137333] hover:bg-[#CEEAD6] transition-all"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(applicationId, "Rejected")}
                                                                    className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FCE8E6] text-[#C5221F] hover:bg-[#FAD2CF] transition-all"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="p-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <select
                                                                    onChange={(e) => setSelectedMentor(e.target.value)}
                                                                    className="px-2 py-1 rounded-lg border border-[#DADCE0] text-xs text-[#202124] focus:border-[#FA6400] focus:outline-none"
                                                                >
                                                                    <option value="">Select Mentor</option>
                                                                    {mentors.map((m) => (
                                                                        <option key={m.mentorId} value={m.mentorId}>
                                                                            {m.firstName} {m.lastName} ({m.department || "Faculty"})
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    onClick={() => handleAssignMentor(student?.studentId)}
                                                                    className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FA6400] text-white hover:bg-[#E65100] transition-all"
                                                                >
                                                                    Assign
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-[#E0E0E0] flex justify-end">
                            <button
                                onClick={() => setShowApplicants(false)}
                                className="btn-google-outlined text-xs py-2 px-6"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
