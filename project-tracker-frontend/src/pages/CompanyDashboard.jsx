import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

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
    const [newInternship, setNewInternship] = useState({
        title: "",
        description: "",
        duration: "",
        stipend: "",
        status: "Active",
    });

    const companyId = localStorage.getItem("pt_id");
    const companyName = localStorage.getItem("pt_name") || "Company";

    // ✅ Fetch internships + analytics
    useEffect(() => {
        if (!companyId) {
            navigate("/");
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
                console.error("Error loading data:", error);
                alert("Failed to load company data.");
            } finally {
                setLoading(false);
            }
        };

        // ✅ await call properly
        (async () => await fetchData())();
    }, [companyId, navigate]);

    // ✅ Fetch mentors for dropdown
    const fetchMentors = async () => {
        try {
            const res = await api.get("/mentors");
            setMentors(res.data);
        } catch (error) {
            console.error("Error fetching mentors:", error);
        }
    };

    // ✅ Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInternship((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Create new internship
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newInternship, company: { companyId: parseInt(companyId) } };
            const res = await api.post("/internships", payload);
            alert(res.data.message || "✅ Internship created successfully!");
            setInternships([...internships, res.data]);
            setNewInternship({ title: "", description: "", duration: "", stipend: "", status: "Active" });
        } catch (error) {
            console.error("Error creating internship:", error);
            alert("❌ Failed to create internship.");
        }
    };

    // ✅ Delete internship
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this internship?")) return;
        try {
            await api.delete(`/internships/${id}`);
            alert("🗑️ Internship deleted successfully!");
            setInternships((prev) => prev.filter((i) => i.internshipId !== id));
        } catch (error) {
            console.error("Error deleting internship:", error);
            alert("❌ Could not delete internship.");
        }
    };

    // ✅ View applicants for an internship
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

    // ✅ Update applicant status
    const handleStatusChange = async (applicationId, status) => {
        try {
            await api.put(`/companies/applications/${applicationId}/status?status=${status}`);
            alert(`✅ Application ${applicationId} updated to ${status}`);
            setApplicants((prev) =>
                prev.map((app) =>
                    app.applicationId === applicationId ? { ...app, status } : app
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Failed to update application status.");
        }
    };

    // ✅ Assign mentor to student
    const handleAssignMentor = async (studentId) => {
        if (!selectedMentor) {
            alert("Please select a mentor first!");
            return;
        }
        try {
            await api.put(
                `/companies/assign-mentor?mentorId=${selectedMentor}&studentId=${studentId}&internshipId=${selectedInternship.internshipId}`
            );
            alert("✅ Mentor assigned successfully!");
        } catch (error) {
            console.error("Error assigning mentor:", error);
            alert("❌ Failed to assign mentor.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8">
            <Navbar />
            <h1 className="text-4xl font-bold text-center mb-8">
                Welcome, {companyName} 👋
            </h1>

            {/* 📊 Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center">
                    <h3 className="text-xl font-semibold">Total Internships</h3>
                    <p className="text-3xl font-bold mt-2">{analytics?.totalInternships || 0}</p>
                </div>
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center">
                    <h3 className="text-xl font-semibold">Total Applications</h3>
                    <p className="text-3xl font-bold mt-2">{analytics?.totalApplications || 0}</p>
                </div>
                <div className="bg-white/10 border border-white/20 p-6 rounded-2xl text-center">
                    <h3 className="text-xl font-semibold">Accepted Students</h3>
                    <p className="text-3xl font-bold mt-2">{analytics?.acceptedCount || 0}</p>
                </div>
            </div>

            {/* 🧾 Internship List */}
            {loading ? (
                <p className="text-center text-gray-300">Loading internships...</p>
            ) : internships.length === 0 ? (
                <p className="text-center text-gray-300 mb-10">No internships posted yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {internships.map((internship) => {
                        const { internshipId, title, description, duration, stipend, status } =
                            internship;
                        return (
                            <div
                                key={internshipId}
                                className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                            >
                                <h3 className="text-xl font-bold text-blue-700 mb-2">{title}</h3>
                                <p className="text-sm mb-1">{description}</p>
                                <p className="text-sm mb-1">
                                    <b>Duration:</b> {duration}
                                </p>
                                <p className="text-sm mb-1">
                                    <b>Stipend:</b> ₹{stipend}
                                </p>
                                <p className="text-sm mb-1">
                                    <b>Status:</b> {status}
                                </p>
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleViewApplicants(internship)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 flex-1"
                                    >
                                        View Applicants
                                    </button>
                                    <button
                                        onClick={() => handleDelete(internshipId)}
                                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 flex-1"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ➕ Post New Internship */}
            <div className="max-w-lg mx-auto bg-white text-gray-800 rounded-2xl p-6 shadow-xl mb-10">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">➕ Post a New Internship</h3>
                <form onSubmit={handleCreate} className="space-y-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newInternship.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newInternship.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    ></textarea>
                    <input
                        type="text"
                        name="duration"
                        placeholder="Duration (e.g., 3 Months)"
                        value={newInternship.duration}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="number"
                        name="stipend"
                        placeholder="Stipend (₹)"
                        value={newInternship.stipend}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                    >
                        Post Internship
                    </button>
                </form>
            </div>

            {/* 👥 Applicants Modal */}
            {showApplicants && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white text-gray-800 rounded-2xl w-11/12 max-w-3xl p-6 shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-4 text-blue-700">
                            Applicants for {selectedInternship?.title}
                        </h2>

                        {applicants.length === 0 ? (
                            <p className="text-gray-500 text-center">No applicants yet.</p>
                        ) : (
                            <table className="w-full border border-gray-300 text-left text-sm">
                                <thead className="bg-blue-100 text-blue-800">
                                <tr>
                                    <th className="p-2">Student ID</th>
                                    <th className="p-2">Status</th>
                                    <th className="p-2">Resume</th>
                                    <th className="p-2 text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {applicants.map((app) => {
                                    const { applicationId, student, status, resumeUrl } = app;
                                    return (
                                        <tr key={applicationId} className="border-t">
                                            <td className="p-2">{student?.studentId}</td>
                                            <td className="p-2">{status}</td>
                                            <td className="p-2">
                                                {app.resumeUrl ? (
                                                    <a
                                                        href={app.resumeUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        View Resume
                                                    </a>
                                                ) : (
                                                    "Not Provided"
                                                )}
                                            </td>
                                            <td className="p-2 text-center">
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(applicationId, "Accepted")
                                                    }
                                                    className="bg-green-600 text-white px-3 py-1 rounded-lg mr-2 hover:bg-green-700"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(applicationId, "Rejected")
                                                    }
                                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                                                >
                                                    Reject
                                                </button>
                                                <div className="mt-3">
                                                    <select
                                                        onChange={(e) =>
                                                            setSelectedMentor(e.target.value)
                                                        }
                                                        className="border px-2 py-1 rounded-lg"
                                                    >
                                                        <option value="">Select Mentor</option>
                                                        {mentors.map((m) => (
                                                            <option key={m.mentorId} value={m.mentorId}>
                                                                {m.firstName} {m.lastName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button
                                                        onClick={() =>
                                                            handleAssignMentor(student?.studentId)
                                                        }
                                                        className="bg-blue-600 text-white px-3 py-1 rounded-lg ml-2 hover:bg-blue-700"
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
                        )}

                        <button
                            onClick={() => setShowApplicants(false)}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* 🔴 Logout */}
            <div className="flex justify-center mt-10">
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
