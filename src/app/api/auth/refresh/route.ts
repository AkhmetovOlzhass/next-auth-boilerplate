import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const refreshToken = (await cookies()).get('refreshToken')?.value;
    const callbackUrl = req.nextUrl.searchParams.get('callbackUrl') || '/dashboard';

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 401 });
    }

    const graphqlResponse = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Refresh($token: String!) {
            refreshToken(token: $token) {
              accessToken
              refreshToken
              user { id email }
            }
          }
        `,
        variables: { token: refreshToken },
      }),
    });

    const data = await graphqlResponse.json();

    if (data.errors || !data.data?.refreshToken) {
      const response = NextResponse.json(
        { error: data.errors?.[0]?.message || 'Token refresh failed' },
        { status: 401 },
      );
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }

    const { accessToken, refreshToken: newRefreshToken } = data.data.refreshToken;

    const absoluteCallbackUrl = new URL(callbackUrl, req.url);
    const response = NextResponse.redirect(absoluteCallbackUrl);

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15,
      path: '/',
    });

    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'An error occurred during token refresh' }, { status: 500 });
  }
}
