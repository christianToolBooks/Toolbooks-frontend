// lib/serverApiClient.ts
import axios from "axios";
import { getToken } from "next-auth/jwt";
import { NextApiRequest } from "next";

const baseURL = process.env.NEXT_PUBLIC_API_URL!;

export const getServerApiClient = async (req: NextApiRequest) => {
    const token = await getToken({ req });

    const instance = axios.create({ baseURL });

    if (token) {
        instance.interceptors.request.use((config) => {
            config.headers.Authorization = `Bearer ${token.idToken}`; 
            return config;
        });
    }

    return instance;
};