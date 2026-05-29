
import axios from "axios";
import { BASE_URL } from "./api";


export const getAllDocuments = async () => {
    const response = await axios.get(`${BASE_URL}/documents/all`,{
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`
        },
    });
    return response.data;
}

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${BASE_URL}/documents/upload`, formData, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("mediq_token") || ""}`,
            
        },
    });

    return response.data;
};

