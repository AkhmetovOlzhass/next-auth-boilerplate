import { jwtDecode } from 'jwt-decode';

type DecodedToken = { sub: string; email: string; exp: number };

type User = { id: string; email: string };

export async function getCurrentUser(accessToken: string): Promise<User | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/auth/me`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn('[auth-utils] Failed to fetch user:', res.statusText);
      return null;
    }

    const data = await res.json();

    if (!data?.id || !data?.email) return null;

    return {
      id: data.id,
      email: data.email,
    };
  } catch (e) {
    console.error('[auth-utils] API call failed:', e);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch {
    return true;
  }
}
