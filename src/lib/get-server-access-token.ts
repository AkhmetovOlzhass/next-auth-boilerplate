import { cookies } from 'next/headers';

export async function getServerAccessToken(): Promise<string | null> {
  return (await cookies()).get('accessToken')?.value || null;
}
