import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AcademicCapIcon, BriefcaseIcon, UserGroupIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import api from "../services/api";

export default function HomePage() {
    const navigate = useNavigate();

    const roles = [
        {
            name: "Students",
            roleKey: "student",
            icon: <AcademicCapIcon className="h-7 w-7 text-[#FA6400]" />,
            tagline: "Explore & Apply",
            desc: "Discover verified corporate internships, submit validated resumes, and track evaluations in real time.",
            btn: "Student Portal",
        },
        {
            name: "Faculty Mentors",
            roleKey: "mentor",
            icon: <UserGroupIcon className="h-7 w-7 text-[#FFB300]" />,
            tagline: "Guide & Evaluate",
            desc: "Review student applications, assign institutional project marks, and provide structured academic feedback.",
            btn: "Mentor Portal",
        },
        {
            name: "Partner Companies",
            roleKey: "company",
            icon: <BriefcaseIcon className="h-7 w-7 text-[#FA6400]" />,
            tagline: "Recruit & Track",
            desc: "Publish internship openings, screen candidate resumes, and collaborate directly with academic mentors.",
            btn: "Company Portal",
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#202124] font-sans flex flex-col justify-between">
            {/* Minimalist Google Header */}
            <header className="border-b border-[#E0E0E0] bg-white">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FA6400] to-[#FFB300] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            🌅
                        </div>
                        <span className="text-lg font-medium text-[#202124]">
                            Project<span className="text-[#FA6400] font-semibold">Tracker</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-google-outlined text-xs py-1.5 px-4">
                            Sign in
                        </Link>
                        <Link to="/register" className="btn-google-primary text-xs py-1.5 px-4">
                            Create account
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-6xl mx-auto px-6 pt-16 pb-20 flex-grow">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0D4] text-[#C26100] border border-[#FFE0B2] mb-6">
                            ✨ Built with Material Design & Supabase PostgreSQL
                        </span>
                        <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-[#202124] leading-tight">
                            Track internships. <br />
                            <span className="text-[#FA6400] font-semibold">Empower campus talent.</span>
                        </h1>
                        <p className="mt-5 text-base md:text-lg text-[#5F6368] leading-relaxed">
                            A unified, enterprise-grade academic platform connecting students, mentors, and corporate recruiters with complete transparency and relational integrity.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                        className="mt-8 flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/register" className="btn-google-primary text-sm py-2.5 px-6 shadow-sm">
                            Get started now <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                        <a
                            href="http://localhost:8080/swagger-ui.html"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-google-outlined text-sm py-2.5 px-6"
                        >
                            Explore REST API (Swagger)
                        </a>
                    </motion.div>
                </div>

                {/* Portal Cards */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((r, idx) => (
                        <motion.div
                            key={r.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + idx * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                            className="google-card p-8 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#FFF0D4] flex items-center justify-center mb-5 border border-[#FFE0B2]">
                                    {r.icon}
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#FA6400]">
                                    {r.tagline}
                                </span>
                                <h3 className="text-xl font-medium text-[#202124] mt-1 mb-3">
                                    {r.name}
                                </h3>
                                <p className="text-sm text-[#5F6368] leading-relaxed mb-6">
                                    {r.desc}
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/login?role=${r.roleKey}`)}
                                className="w-full btn-google-outlined text-sm py-2"
                            >
                                Enter {r.btn}
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* 🎯 Instant Reviewer Demo Access Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-16 bg-white border-2 border-[#FFE0B2] rounded-3xl p-8 shadow-sm"
                >
                    <div className="border-b border-[#F1F3F4] pb-6 mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF0D4] text-[#C26100] mb-2">
                            <span>🎯</span> Instant Evaluation Demo (Pre-Seeded)
                        </div>
                        <h2 className="text-2xl font-medium text-[#202124]">
                            Test Drive All Three Portals
                        </h2>
                        <p className="text-sm text-[#5F6368] mt-1">
                            Click any portal below to instantly log in as a pre-populated test persona with real Supabase database records.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Demo Student */}
                        <div className="border border-[#E0E0E0] rounded-2xl p-5 bg-[#F8F9FA] flex flex-col justify-between hover:border-[#FA6400] transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[#FA6400] uppercase tracking-wider">Student Persona</span>
                                    <span className="status-pill-interviewing text-[10px]">Active Candidate</span>
                                </div>
                                <h3 className="text-base font-semibold text-[#202124]">Alex Chen</h3>
                                <p className="text-xs text-[#5F6368] mt-0.5">Computer Science & Distributed Systems</p>
                                <p className="text-xs text-[#5F6368] mt-3 bg-white p-3 rounded-lg border border-[#E0E0E0]">
                                    Pre-loaded with 5 active applications across Interviewing and Offered stages, PDF resumes, and faculty review marks.
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post("/auth/login/student", {
                                            email: "demo.student@google.com",
                                            password: "Password@123"
                                        });
                                        const d = res.data;
                                        localStorage.setItem("pt_id", d.studentId);
                                        localStorage.setItem("pt_name", d.name);
                                        localStorage.setItem("pt_email", d.email);
                                        localStorage.setItem("pt_role", "student");
                                        localStorage.setItem("pt_token", d.token);
                                        navigate("/student");
                                    } catch (e) {
                                        navigate("/login?role=student");
                                    }
                                }}
                                className="mt-5 w-full btn-google-primary text-xs py-2"
                            >
                                🚀 1-Click Launch Student Portal
                            </button>
                        </div>

                        {/* Demo Mentor */}
                        <div className="border border-[#E0E0E0] rounded-2xl p-5 bg-[#F8F9FA] flex flex-col justify-between hover:border-[#FFB300] transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[#B06000] uppercase tracking-wider">Faculty Mentor</span>
                                    <span className="status-pill-offered text-[10px]">Assigned Reviewer</span>
                                </div>
                                <h3 className="text-base font-semibold text-[#202124]">Dr. Sarah Connor</h3>
                                <p className="text-xs text-[#5F6368] mt-0.5">Assoc. Professor, Computer Science</p>
                                <p className="text-xs text-[#5F6368] mt-3 bg-white p-3 rounded-lg border border-[#E0E0E0]">
                                    Assigned to review student submissions, grade projects with institutional rubrics, and publish verified evaluation feedback.
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post("/auth/login/mentor", {
                                            email: "demo.mentor@google.com",
                                            password: "Password@123"
                                        });
                                        const d = res.data;
                                        localStorage.setItem("pt_id", d.mentorId);
                                        localStorage.setItem("pt_name", d.name);
                                        localStorage.setItem("pt_email", d.email);
                                        localStorage.setItem("pt_role", "mentor");
                                        localStorage.setItem("pt_token", d.token);
                                        navigate("/mentor");
                                    } catch (e) {
                                        navigate("/login?role=mentor");
                                    }
                                }}
                                className="mt-5 w-full btn-google-primary text-xs py-2 bg-[#FFB300] hover:bg-[#FFA000]"
                            >
                                🚀 1-Click Launch Mentor Portal
                            </button>
                        </div>

                        {/* Demo Company */}
                        <div className="border border-[#E0E0E0] rounded-2xl p-5 bg-[#F8F9FA] flex flex-col justify-between hover:border-[#FA6400] transition-all">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-[#FA6400] uppercase tracking-wider">Enterprise Partner</span>
                                    <span className="status-pill-applied text-[10px]">Google Cloud</span>
                                </div>
                                <h3 className="text-base font-semibold text-[#202124]">Google Cloud & Systems</h3>
                                <p className="text-xs text-[#5F6368] mt-0.5">Mountain View, CA</p>
                                <p className="text-xs text-[#5F6368] mt-3 bg-white p-3 rounded-lg border border-[#E0E0E0]">
                                    Published 4 cloud engineering roles, active applicant tracking pipeline, real-time analytics, and mentor allocation.
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await api.post("/auth/login/company", {
                                            email: "demo.company@google.com",
                                            password: "Password@123"
                                        });
                                        const d = res.data;
                                        localStorage.setItem("pt_id", d.companyId);
                                        localStorage.setItem("pt_name", d.name);
                                        localStorage.setItem("pt_email", d.email);
                                        localStorage.setItem("pt_role", "company");
                                        localStorage.setItem("pt_token", d.token);
                                        navigate("/company");
                                    } catch (e) {
                                        navigate("/login?role=company");
                                    }
                                }}
                                className="mt-5 w-full btn-google-primary text-xs py-2"
                            >
                                🚀 1-Click Launch Company Portal
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Key Technical Highlights (Interview Ready) */}
                <div className="mt-24 border-t border-[#E0E0E0] pt-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="p-4">
                            <h4 className="text-2xl font-bold text-[#FA6400]">PostgreSQL</h4>
                            <p className="text-xs text-[#5F6368] mt-1 font-medium">Supabase Cloud Database</p>
                        </div>
                        <div className="p-4">
                            <h4 className="text-2xl font-bold text-[#202124]">Flyway</h4>
                            <p className="text-xs text-[#5F6368] mt-1 font-medium">Versioned Migrations</p>
                        </div>
                        <div className="p-4">
                            <h4 className="text-2xl font-bold text-[#FA6400]">BCrypt + JWT</h4>
                            <p className="text-xs text-[#5F6368] mt-1 font-medium">256-Bit Stateless Auth</p>
                        </div>
                        <div className="p-4">
                            <h4 className="text-2xl font-bold text-[#202124]">Rate Limited</h4>
                            <p className="text-xs text-[#5F6368] mt-1 font-medium">Brute Force Protected</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Google-like Clean Footer */}
            <footer className="border-t border-[#E0E0E0] bg-white py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#5F6368] gap-4">
                    <p>© {new Date().getFullYear()} Project & Internship Tracker — Campus DBMS Engineering Portfolio</p>
                    <div className="flex gap-6">
                        <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-[#202124]">
                            Swagger API
                        </a>
                        <Link to="/login" className="hover:text-[#202124]">
                            Sign in
                        </Link>
                        <Link to="/register" className="hover:text-[#202124]">
                            Register
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
