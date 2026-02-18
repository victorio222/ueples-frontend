import { useState } from 'react';
import API from '../api';

export const useData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = async <T>(promise: Promise<{ data: { data: T } }>) => {
        try {
            setLoading(true);
            setError(null);
            const response = await promise;
            return response.data.data;
        } catch (err: any) {
            const msg = err.response?.data?.message || "An unexpected error occurred";
            setError(msg);
            throw msg;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error };
};