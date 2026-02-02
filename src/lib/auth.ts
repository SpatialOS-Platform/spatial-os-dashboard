export const AUTH_TOKEN_KEY = "spatial_auth_token";

export async function login(principalId: string, type: "user" | "app" = "user"): Promise<boolean> {
    try {
        // TODO: Replace with actual API call when backend is reachable
        // const response = await fetch("/v1/auth/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ principal_id: principalId, type }),
        // });

        // if (!response.ok) return false;
        // const data = await response.json();
        // localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        // Mock Login for now
        console.log("Logging in as:", principalId);
        const mockToken = `mock_jwt_${btoa(principalId)}_${Date.now()}`;
        localStorage.setItem(AUTH_TOKEN_KEY, mockToken);

        return true;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
}

export function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = "/login";
}

export function isAuthenticated() {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
}
