import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function StudentDashboard() {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appliedInternships, setAppliedInternships] = useState([]);
    const [evaluations, setEvaluations] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    const studentId = localStorage.getItem("pt_id");
    const name = localStorage.getItem("pt_name");

    // ✅ Fetch all internships
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

    // ✅ Fetch already applied internships
    useEffect(() => {
        const fetchApplied = async () => {
            try {
                const res = await api.get(`/applications/student/${studentId}`);
                const mapped = res.data.map((a) => ({
                    internshipId: a.internship.internshipId,
                    status: a.status,
                }));
                setAppliedInternships(mapped);
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };
        if (studentId) fetchApplied();
    }, [studentId]);

    // ✅ Fetch evaluations
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

    // ✅ Apply for internship with resume
    const handleApply = async (internshipId) => {
        try {
            let resumeUrl = "";

            // Upload resume if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const uploadRes = await api.post("/upload/resume", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                resumeUrl = JSON.parse(uploadRes.data).url;
            }

            const payload = {
                student: { studentId: parseInt(studentId) },
                internship: { internshipId },
                resumeUrl,
            };

            await api.post("/applications", payload);
            alert("✅ Application submitted successfully!");

            setAppliedInternships([
                ...appliedInternships,
                { internshipId, status: "Pending" },
            ]);
        } catch (error) {
            console.error("Error applying:", error);
            alert("❌ Could not apply for internship.");
        }
    };

    // ✅ Logout handler
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // ✅ Status style handler
    const getStatusStyle = (status) => {
        switch (status) {
            case "Accepted":
                return "bg-green-500 text-white";
            case "Rejected":
                return "bg-red-500 text-white";
            case "Pending":
            case "Applied":
                return "bg-yellow-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-8">
            <Navbar />

            <h1 className="text-4xl font-bold text-center mb-8">
                Welcome, {name || "Student"} 👋
            </h1>

            {/* ✅ Internships Section */}
            <h2 className="text-2xl font-semibold mb-6 text-center">
                Available Internships
            </h2>

            {loading ? (
                <p className="text-center text-gray-300">Loading internships...</p>
            ) : internships.length === 0 ? (
                <p className="text-center text-gray-300">No internships available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {internships.map((internship) => {
                        const applied = appliedInternships.find(
                            (a) => a.internshipId === internship.internshipId
                        );
                        const status = applied?.status || null;

                        return (
                            <div
                                key={internship.internshipId}
                                className="bg-white text-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-blue-700 mb-2">
                                    {internship.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {internship.description}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Duration:</span>{" "}
                                    {internship.duration}
                                </p>
                                <p className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">Stipend:</span> ₹
                                    {internship.stipend}
                                </p>
                                <p className="text-sm text-gray-600 mb-4">
                                    <span className="font-semibold">Status:</span>{" "}
                                    {internship.status}
                                </p>

                                {status ? (
                                    <button
                                        disabled
                                        className={`w-full py-2 rounded-lg font-semibold opacity-90 cursor-not-allowed ${getStatusStyle(
                                            status
                                        )}`}
                                    >
                                        {status}
                                    </button>
                                ) : (
                                    <>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            className="w-full text-sm text-gray-700 mt-2 border rounded-lg p-1 bg-gray-50"
                                        />
                                        <button
                                            onClick={() => handleApply(internship.internshipId)}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-all duration-200 mt-2"
                                        >
                                            Apply Now
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ✅ Evaluations Section */}
            <h2 className="text-2xl font-semibold mt-16 mb-6 text-center">
                My Evaluations
            </h2>

            {evaluations.length === 0 ? (
                <p className="text-center text-gray-300">
                    No evaluations yet — wait for your mentor to review your work.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {evaluations.map((evalItem) => (
                        <div
                            key={evalItem.evaluationId}
                            className="bg-white text-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                        >
                            <h3 className="text-xl font-bold text-blue-700 mb-2">
                                Evaluation #{evalItem.evaluationId}
                            </h3>
                            <p className="text-sm mb-1">
                                <b>Marks:</b> {evalItem.marksObtained} /{" "}
                                {evalItem.maxMarks}
                            </p>
                            <p className="text-sm mb-1">
                                <b>Remarks:</b> {evalItem.remarks || "No remarks given"}
                            </p>
                            <p className="text-sm mb-1">
                                <b>Mentor ID:</b> {evalItem.mentor?.mentorId || "N/A"}
                            </p>
                            <p className="text-sm text-gray-600">
                                <b>Date:</b>{" "}
                                {new Date(evalItem.evaluationDate).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* ✅ Logout */}
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
