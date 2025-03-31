import axios from "axios";

const API_BASE_URL = "http://localhost:8085/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiService = {
  // Create a new tree
  createTree: async (numbers, balanced = false) => {
    try {
      const response = await apiClient.post("/trees", {
        numbers,
        balanced,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating tree:", error);
      throw error;
    }
  },

  // Get a specific tree by ID
  getTreeById: async (id) => {
    try {
      const response = await apiClient.get(`/trees/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tree with ID ${id}:`, error);
      throw error;
    }
  },

  // Get all previous trees
  getAllTrees: async () => {
    try {
      const response = await apiClient.get("/trees");
      return response.data;
    } catch (error) {
      console.error("Error fetching all trees:", error);
      throw error;
    }
  },
};

export default apiService;
