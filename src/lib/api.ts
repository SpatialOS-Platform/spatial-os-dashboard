// Backend API running on Wrangler dev server
const API_URL = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787')
    : 'http://localhost:8787';

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    // Client-side only check for localStorage
    let token = '';
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token') || '';
    }

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string>),
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || data.details || 'API request failed');
    }
    return data;
}

export const auth = {
    login: (credentials: { username: string, password: string }) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (data: { username: string, email: string, password: string }) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    me: () => fetchAPI('/auth/me', { method: 'GET' }),
};

export const admin = {
    getUsers: () => fetchAPI('/admin/users', { method: 'GET' }),
    createKey: (data: { owner_id: string, tier: string }) => fetchAPI('/admin/keys', { method: 'POST', body: JSON.stringify(data) }),
    getKeys: () => fetchAPI('/admin/keys', { method: 'GET' }),
    revokeKey: (keyId: string) => fetchAPI(`/admin/keys/${keyId}`, { method: 'DELETE' }),
    getStats: () => fetchAPI('/admin/stats', { method: 'GET' })
}

export const spatial = {
    registerAnchor: (data: any) => fetchAPI('/spatial/anchor', { method: 'POST', body: JSON.stringify(data) }),
    updateAnchor: (anchorId: string, data: any) => fetchAPI(`/spatial/anchor/${anchorId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    deleteAnchor: (anchorId: string) => fetchAPI(`/spatial/anchor/${anchorId}`, { method: 'DELETE' }),
    getNearby: (lat: number, lon: number) => fetchAPI(`/spatial/nearby?lat=${lat}&lon=${lon}`, { method: 'GET' }),
    getHierarchy: (spaceId: string) => fetchAPI(`/spatial/hierarchy/${spaceId}`, { method: 'GET' }),
    // Space CRUD
    createSpace: (data: any) => fetchAPI('/spatial/space', { method: 'POST', body: JSON.stringify(data) }),
    getSpaces: () => fetchAPI('/spatial/spaces', { method: 'GET' }),
    getSpace: (spaceId: string) => fetchAPI(`/spatial/space/${spaceId}`, { method: 'GET' }),
    updateSpace: (spaceId: string, data: any) => fetchAPI(`/spatial/space/${spaceId}`, { method: 'PATCH', body: JSON.stringify(data) }),
    getAnchorsInSpace: (spaceId: string) => fetchAPI(`/spatial/space/${spaceId}/anchors`, { method: 'GET' })
}

