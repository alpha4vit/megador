const TOKEN_KEY = 'megador-admin-auth';
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

interface StoredAuth {
    token: string;
    expiresAt: number;
}

export function getAdminToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
        const raw = window.localStorage.getItem(TOKEN_KEY);
        if (!raw) return null;
        const auth = JSON.parse(raw) as StoredAuth;
        if (!auth.token || Date.now() >= auth.expiresAt) {
            window.localStorage.removeItem(TOKEN_KEY);
            return null;
        }
        return auth.token;
    } catch {
        return null;
    }
}

export function setAdminToken(token: string, expiresInMs: number): void {
    const auth: StoredAuth = {token, expiresAt: Date.now() + expiresInMs};
    window.localStorage.setItem(TOKEN_KEY, JSON.stringify(auth));
}

export function clearAdminToken(): void {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
    return getAdminToken() !== null;
}

export async function adminLogin(username: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
    });
    if (!res.ok) {
        throw new Error(res.status === 401 ? 'Неверное имя пользователя или пароль' : `Ошибка входа: ${res.status}`);
    }
    const data = (await res.json()) as {token: string; expiresIn: number};
    setAdminToken(data.token, data.expiresIn);
}
