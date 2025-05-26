import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const graphqlResponse = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          mutation Login($data: LoginInput!) {
            login(data: $data) {
              accessToken
              refreshToken
              user { id email }
            }
          }
        `,
        variables: {
          data: { email, password },
        },
      }),
    });

    const data = await graphqlResponse.json();

    if (data.errors) {
      return NextResponse.json(
        { error: data.errors[0].message || 'Login failed' },
        { status: 400 },
      );
    }

    const { accessToken, refreshToken, user } = data.data.login;

    const response = NextResponse.json({ success: true, user });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
      path: '/',
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json({ error: 'An error occurred during sign in' }, { status: 500 });
  }
}
