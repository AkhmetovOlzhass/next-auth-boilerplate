import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

  try {
    if (accessToken) {
      await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          query: 'mutation { logout }',
        }),
      });
    }
  } catch (error) {
    console.warn('GraphQL logout failed, continuing to clear cookies');
  }

  (await cookieStore).delete('accessToken');
  (await cookieStore).delete('refreshToken');

  return NextResponse.redirect(
    new URL('/', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  );
}
