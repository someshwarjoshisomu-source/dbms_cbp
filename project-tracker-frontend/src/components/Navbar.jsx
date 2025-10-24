import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const role = localStorage.getItem("pt_role");
    const name = localStorage.getItem("pt_name");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    // dynamic links based on role
    const navLinks = {
        student: [
            { path: "/student", label: "Home" },
            { path: "/student/applications", label: "My Applications" },
        ],
        mentor: [
            { path: "/mentor", label: "Dashboard" },
            { path: "/mentor/evaluations", label: "Evaluations" },
        ],
        company: [
            { path: "/company", label: "Dashboard" },
            { path: "/company/post", label: "Post Internship" },
            { path: "/company/applicants", label: "Applicants" },
        ],
    };

    const links = navLinks[role] || [];

    return (
        <nav className="flex items-center justify-between bg-indigo-900 text-white px-6 py-3 shadow-lg">
            <div className="text-xl font-bold tracking-wide">
                Project Tracker <span className="text-indigo-300">Portal</span>
            </div>

            <ul className="flex space-x-6">
                {links.map((l) => (
                    <li key={l.path}>
                        <Link
                            to={l.path}
                            className="hover:text-indigo-300 transition-all font-medium"
                        >
                            {l.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-200 hidden sm:block">
          {name ? `Hi, ${name.split(" ")[0]} 👋` : ""}
        </span>
                <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm font-semibold"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
