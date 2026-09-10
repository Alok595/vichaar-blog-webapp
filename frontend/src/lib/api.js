import { useAuthStore } from "./authStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const token = useAuthStore.getState().token;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || `API request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${options.method || "GET"} ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: async (credentials) => {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return request("/auth/me");
  },

  // Public Posts
  getPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/posts${query ? `?${query}` : ""}`);
  },

  getPostById: async (id) => {
    return request(`/posts/${id}`);
  },

  // Author-Specific Protected Endpoints
  getMyPosts: async () => {
    return request("/posts/my-posts");
  },

  createPost: async (postData) => {
    return request("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  updatePost: async (id, postData) => {
    return request(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (id) => {
    return request(`/posts/${id}`, {
      method: "DELETE",
    });
  },
};
