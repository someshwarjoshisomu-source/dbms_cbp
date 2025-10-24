import React, { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function MentorDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const mentorId = localStorage.getItem("pt_id");
    const mentorName = localStorage.getItem("pt_name") || "Mentor";

    // ✅ Fetch applications
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get("/mentor/applications");
                setApplications(res.data);
            } catch (error) {
                console.error("Error fetching applications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // ✅ Update application status
    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/mentor/applications/${id}/status?status=${status}`);
            alert(`✅ Application ${id} updated to ${status}`);
            setApplications((prev) =>
                prev.map((a) =>
                    a.applicationId === id ? { ...a, status } : a
                )
            );
        } catch (error) {
            console.error("Error updating status:", error);
            alert("❌ Failed to update application status.");
        }
    };

    // ✅ Add evaluation
    const handleEvaluation = async (app) => {
        if (!app._marks || !app._maxMarks) {
            alert("⚠️ Please enter both marks fields.");
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
            alert(res.data.message || "✅ Evaluation saved!");
        } catch (error) {
            console.error("Error submitting evaluation:", error);
            alert("❌ Failed to save evaluation.");
        }
    };

    // ✅ Logout
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 text-white p-8">
            <Navbar />

            <h1 className="text-4xl font-bold text-center mb-8">
                Welcome, {mentorName} 👋
            </h1>
            <h2 className="text-2xl text-center mb-6">Student Applications</h2>

            {loading ? (
                <p className="text-center text-gray-300">Loading applications...</p>
            ) : applications.length === 0 ? (
                <p className="text-center text-gray-300">No applications found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div
                            key={app.applicationId}
                            className="bg-white text-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                        >
                            <h3 className="text-xl font-bold text-blue-700 mb-2">
                                {app.internship?.title || "Unknown Internship"}
                            </h3>

                            <p className="text-sm mb-1">
                                <b>Student ID:</b> {app.student?.studentId || "N/A"}
                            </p>
                            <p className="text-sm mb-1">
                                <b>Status:</b> {app.status || "Pending"}
                            </p>
                            <p className="text-sm mb-3">
                                <b>Resume:</b>{" "}
                                {app.resumeUrl ? (
                                    <a
                                        href={app.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View Resume
                                    </a>
                                ) : (
                                    "Not Provided"
                                )}
                            </p>

                            {/* ✅ Action Buttons */}
                            <div className="flex gap-3 mt-2">
                                <button
                                    onClick={() =>
                                        handleStatusChange(app.applicationId, "Accepted")
                                    }
                                    className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 w-1/2"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() =>
                                        handleStatusChange(app.applicationId, "Rejected")
                                    }
                                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 w-1/2"
                                >
                                    Reject
                                </button>
                            </div>

                            {/* ✅ Evaluation Section */}
                            {app.status === "Accepted" && (
                                <div className="mt-5 border-t pt-4">
                                    <h4 className="text-md font-semibold mb-2 text-gray-700">
                                        Add Evaluation
                                    </h4>
                                    <input
                                        type="number"
                                        placeholder="Marks Obtained"
                                        onChange={(e) =>
                                            (app._marks = e.target.value)
                                        }
                                        className="border rounded-lg px-3 py-1 w-full mb-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Marks"
                                        onChange={(e) =>
                                            (app._maxMarks = e.target.value)
                                        }
                                        className="border rounded-lg px-3 py-1 w-full mb-2"
                                    />
                                    <textarea
                                        placeholder="Remarks"
                                        onChange={(e) =>
                                            (app._remarks = e.target.value)
                                        }
                                        className="border rounded-lg px-3 py-1 w-full mb-2"
                                    ></textarea>
                                    <button
                                        onClick={() => handleEvaluation(app)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg w-full"
                                    >
                                        Submit Evaluation
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

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
