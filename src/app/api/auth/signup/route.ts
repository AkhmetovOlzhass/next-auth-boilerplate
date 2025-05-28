import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const signupRes = await fetch(`${process.env.BACKEND_URL}/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation Signup($data: SignupInput!) {
            signup(data: $data)
          }
        `,
        variables: { data: { email, password } },
      }),
    });

    const signupData = await signupRes.json();

    if (signupData.errors) {
      return NextResponse.json(
        { error: signupData.errors[0].message || 'Signup failed' },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'An error occurred during signup' }, { status: 500 });
  }
}
