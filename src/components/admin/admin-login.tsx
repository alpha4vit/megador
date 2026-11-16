'use client';

import {useState, type FormEvent} from 'react';
import {Lock, LogIn, AlertCircle} from 'lucide-react';
import {adminLogin} from '@/lib/admin-auth';
import {Field, TextInput} from './fields';

const inputShell =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#2F3E46] focus:outline-none focus:ring-2 focus:ring-[#E65F2B]/40 focus:border-[#E65F2B]';

export function AdminLogin({onSuccess}: {onSuccess: () => void}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (loading) return;
        setError(null);
        setLoading(true);
        try {
            await adminLogin(username.trim(), password);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl bg-[#2F3E46] flex items-center justify-center">
                            <Lock className="w-5 h-5 text-[#E65F2B]"/>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-[#2F3E46]">MEGADOR Admin</h1>
                            <p className="text-xs text-gray-500">Вход в панель управления</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field label="Имя пользователя">
                            <TextInput
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                autoFocus
                                required
                            />
                        </Field>
                        <Field label="Пароль">
                            <TextInput
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </Field>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0"/>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !username || !password}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E65F2B] text-white text-sm font-semibold hover:bg-[#d5541e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <LogIn className="w-4 h-4"/>
                            {loading ? 'Вход…' : 'Войти в панель управления'}
                        </button>
                    </form>
                </div>
                <p className={`${inputShell} mt-4 text-center !border-0 bg-transparent text-xs text-gray-400`}>
                    Доступ только для администраторов
                </p>
            </div>
        </div>
    );
}
