import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const graphqlResponse = await fetch(`${process.env.BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query: 'mutation Confirm($token: String!) { confirmEmail(token: $token) }',
        variables: { token },
      }),
    });

    const data = await graphqlResponse.json();

    if (data?.errors?.length || data?.data?.confirmEmail !== true) {
      return NextResponse.json(
        { error: data.errors?.[0]?.message || 'Email confirmation failed' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json(
      { error: 'An error occurred during email confirmation' },
      { status: 500 },
    );
  }
}
