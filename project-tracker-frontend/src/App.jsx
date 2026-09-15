import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/*" element={<StudentDashboard />} />
                <Route path="/mentor" element={<MentorDashboard />} />
                <Route path="/mentor/*" element={<MentorDashboard />} />
                <Route path="/company" element={<CompanyDashboard />} />
                <Route path="/company/*" element={<CompanyDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
