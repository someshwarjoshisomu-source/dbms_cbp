import { Link } from "react-router-dom";

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <nav className="flex justify-between items-center p-6 bg-black bg-opacity-20 backdrop-blur-md">
                <h1 className="text-2xl font-bold">Project & Internship Tracker</h1>
                <div className="space-x-4">
                    <Link to="/login" className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200">Login</Link>
                    <Link to="/register" className="border border-white px-4 py-2 rounded-lg font-semibold hover:bg-white hover:text-blue-600">Register</Link>
                </div>
            </nav>

            <div className="flex-grow flex flex-col items-center justify-center text-center p-10">
                <h2 className="text-4xl font-bold mb-4">Streamline Your Projects and Internships</h2>
                <p className="text-lg mb-8 max-w-2xl">
                    A unified platform for Students, Mentors, and Companies to manage projects, apply for internships, and evaluate progress — all in one place.
                </p>
                <Link to="/login" className="bg-white text-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-200">
                    Get Started
                </Link>
            </div>

            <footer className="text-center py-4 bg-black bg-opacity-10">
                © {new Date().getFullYear()} Project Tracker | Developed by Rameshwar Joshi
            </footer>
        </div>
    );
}
