import axios from "axios";

const api = axios.create({
    baseURL: "/api/auth",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
)

export async function register(username, email, password) {
    try {
        const response = await api.post("/register", {
            username,
            email,
            password,
        });

        return response.data;

    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

export async function updateProfile({ fullname, bio, profileImage }) {
    try {
        const formData = new FormData();
        formData.append("fullname", fullname);
        formData.append("bio", bio);
        formData.append("profileImage", profileImage);

        const response = await api.put("/update-profile", formData);

        return response.data;

    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

export async function login(username, email, password) {
    try {
        const response = await api.post("/login", {
            username, email, password
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function logout() {
    try {
        await api.post("/logout");
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

export async function getMe() {
    try {
        const response = await api.get("/get-me");

        return response.data;

    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

