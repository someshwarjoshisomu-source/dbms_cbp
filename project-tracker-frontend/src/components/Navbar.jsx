import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("pt_role");
    const name = localStorage.getItem("pt_name");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const navLinks = {
        student: [
            { path: "/student", hash: "#internships", label: "Internships" },
            { path: "/student", hash: "#applications", label: "My Applications" },
            { path: "/student", hash: "#evaluations", label: "Evaluations" },
        ],
        mentor: [
            { path: "/mentor", hash: "", label: "Review Dashboard" },
        ],
        company: [
            { path: "/company", hash: "", label: "Overview & Postings" },
        ],
    };

    const links = navLinks[role] || [];

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0E0E0] mb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Brand / Logo */}
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-2.5 text-lg font-semibold text-[#202124] tracking-tight hover:opacity-90 transition-opacity">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FA6400] to-[#FFB300] flex items-center justify-center text-white font-bold text-base shadow-sm">
                            🌅
                        </div>
                        <span className="font-medium text-[#202124]">
                            Project<span className="text-[#FA6400] font-semibold">Tracker</span>
                        </span>
                    </Link>

                    {role && (
                        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF0D4] text-[#C26100] capitalize border border-[#FFE0B2]">
                            {role} Portal
                        </span>
                    )}
                </div>

                {/* Navigation Capsule Links */}
                <nav className="hidden md:flex items-center space-x-1">
                    {links.map((link) => {
                        const target = link.hash ? `${link.path}${link.hash}` : link.path;
                        return (
                            <a
                                key={link.label}
                                href={target}
                                className="px-4 py-1.5 rounded-full text-sm font-medium text-[#5F6368] hover:text-[#202124] hover:bg-[#F1F3F4] transition-all"
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </nav>

                {/* User Info & Actions */}
                <div className="flex items-center gap-3">
                    {name && (
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#FA6400]/10 text-[#FA6400] font-bold text-xs flex items-center justify-center border border-[#FA6400]/20">
                                {name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-[#5F6368]">
                                {name.split(" ")[0]}
                            </span>
                        </div>
                    )}

                    <button
                        onClick={handleLogout}
                        className="btn-google-outlined text-xs py-1.5 px-3.5"
                    >
                        Sign out
                    </button>
                </div>
            </div>
        </header>
    );
}
