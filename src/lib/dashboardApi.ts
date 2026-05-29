import axios from "axios";
import { BASE_URL } from "./api";

export const dashbaordStats = async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/dashboardStats`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}

export const KnowledgeStats = async () => {
    const response = await axios.get(`${BASE_URL}/dashboard/knowledgeBase`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}

export const documentQueue = async () => {
    const response = await axios.get(`${BASE_URL}/documents/status`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}
export const getProfileUrl = async () => {
    const response = await axios.get(`${BASE_URL}/auth/profile`,{
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}

export const getUserDetails = async ()=>{
    const response = await axios.get(`${BASE_URL}/auth/allUsers`,{
      headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}   