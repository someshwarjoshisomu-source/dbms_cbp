import api from "./api";

export const loginUser = async (email, password, role) => {
    try {
        const endpoint = `/login/${role.toLowerCase()}`;
        const response = await api.post(endpoint, { email, password });

        // ✅ Save role-specific details in localStorage
        if (role === "Student") {
            localStorage.setItem("pt_id", response.data.studentId);
            localStorage.setItem("pt_name", response.data.name);
            localStorage.setItem("pt_email", response.data.email);
            localStorage.setItem("pt_role", "student");
        } else if (role === "Mentor") {
            localStorage.setItem("pt_id", response.data.mentorId);
            localStorage.setItem("pt_name", response.data.name);
            localStorage.setItem("pt_email", response.data.email);
            localStorage.setItem("pt_role", "mentor");
        } else if (role === "Company") {
            localStorage.setItem("pt_id", response.data.companyId);
            localStorage.setItem("pt_name", response.data.name);
            localStorage.setItem("pt_email", response.data.email);
            localStorage.setItem("pt_role", "company");
        }

        // You can also store the token (for JWT-based APIs later)
        localStorage.setItem("pt_token", response.data.token);

        console.log("✅ Login successful for:", email);
        return response.data;

    } catch (error) {
        console.error("❌ Login failed:", error.response?.data || error.message);
        throw error;
    }
};
