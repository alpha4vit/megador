'use client';

import {useCallback, useEffect, useState} from 'react';
import AdminPanel from './admin-panel';
import {AdminLogin} from './admin-login';
import {clearAdminToken, isAdminAuthenticated} from '@/lib/admin-auth';

/**
 * Client-side guard for /admin: renders the login screen when no valid
 * admin JWT is stored, otherwise the admin panel.
 */
export function AdminGate() {
    const [authed, setAuthed] = useState<boolean | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time auth check from localStorage
        setAuthed(isAdminAuthenticated());
    }, []);

    const handleLogin = useCallback(() => setAuthed(true), []);
    const handleLogout = useCallback(() => {
        clearAdminToken();
        setAuthed(false);
    }, []);

    if (authed === null) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#E65F2B] border-t-transparent rounded-full animate-spin"/>
            </div>
        );
    }

    if (!authed) {
        return <AdminLogin onSuccess={handleLogin}/>;
    }

    return <AdminPanel onLogout={handleLogout}/>;
}
