import { useEffect, useState } from 'react';
import useAuth from './useAuth';
import axios from 'axios';

const useRole = () => {
    const { user } = useAuth();
    const [role, setRole] = useState(null); // 'admin' | 'tutor' | 'student'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) return;

        const fetchRole = async () => {
            try {
                const res = await axios.get(`/users/role/${user.email}`);
                setRole(res.data.role);
            } catch (error) {
                console.error('Error fetching user role:', error);
                setRole('student'); // fallback
            } finally {
                setLoading(false);
            }
        };

        fetchRole();
    }, [user?.email]);

    return [role, loading]; // [ 'admin' | 'tutor' | 'student', boolean ]
};

export default useRole;
