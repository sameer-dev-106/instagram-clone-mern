import axios from "axios";

const api = axios.create({
    baseURL: "/api",
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
);

export async function getFeed(page = 1, limit = 5) {
    try {
        const res = await api.get(`/posts/feed?page=${page}&limit=${limit}`);
        return res.data;
    } catch (error) {
        throw error.res?.data?.message || "Error fetching feed";
    }
}

export const likePost = (postId) => {
    return api.post(`/posts/like/${postId}`);
};

export const unlikePost = (postId) => {
    return api.post(`/posts/unlike/${postId}`);
};

export async function createPost({imageFile, caption}) {
    try {
        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("caption", caption);

        const response = await api.post("/posts", formData);

        return response.data

    } catch (error) {
        throw error.response?.data?.message || "Something went wrong";
    }
}

