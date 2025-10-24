import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon, BriefcaseIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function HomePage() {
    const navigate = useNavigate();

    const roles = [
        {
            name: "Students",
            icon: <AcademicCapIcon className="h-10 w-10 text-indigo-400" />,
            desc: "Apply for internships and manage your academic projects with ease.",
            gradient: "from-indigo-500 to-purple-500",
            btn: "🎓 Student Login",
            route: "student",
        },
        {
            name: "Mentors",
            icon: <UserGroupIcon className="h-10 w-10 text-rose-400" />,
            desc: "Track student progress and provide valuable mentorship insights.",
            gradient: "from-rose-500 to-pink-500",
            btn: "🧑‍🏫 Mentor Login",
            route: "mentor",
        },
        {
            name: "Companies",
            icon: <BriefcaseIcon className="h-10 w-10 text-cyan-400" />,
            desc: "Post internships and recruit top student talent effortlessly.",
            gradient: "from-cyan-500 to-blue-500",
            btn: "🏢 Company Login",
            route: "company",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white font-sans">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-center px-6"
            >
                <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-400 text-transparent bg-clip-text">
                    Track Internships. Manage Projects. Empower Students.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                    A unified platform for students, mentors, and companies to collaborate seamlessly in the campus innovation ecosystem.
                </p>
            </motion.div>

            {/* Role Cards */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-6xl"
            >
                {roles.map((r) => (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        key={r.name}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10 hover:border-white/20 transition-all"
                    >
                        <div className="flex justify-center mb-4">{r.icon}</div>
                        <h3 className="text-2xl font-semibold mb-2 text-center">{r.name}</h3>
                        <p className="text-gray-300 text-center mb-6">{r.desc}</p>
                        <button
                            onClick={() => navigate(`/login?role=${r.route}`)}
                            className={`w-full py-3 font-semibold rounded-xl bg-gradient-to-r ${r.gradient} text-white shadow-md hover:shadow-lg transition-all`}
                        >
                            {r.btn}
                        </button>
                    </motion.div>
                ))}
            </motion.div>

            {/* Footer */}
            <footer className="mt-20 text-gray-400 text-sm pb-8">
                © 2025 Project & Internship Tracker — Built for Innovation 🌍
            </footer>
        </div>
    );
}
