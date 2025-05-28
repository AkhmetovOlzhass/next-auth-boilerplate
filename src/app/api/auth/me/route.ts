import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const response = await fetch(`${process.env.BACKEND_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query Me {
          me {
            id
            email
          }
        }
      `,
    }),
  });

  const json = await response.json();

  if (json?.data?.me?.id && json?.data?.me?.email) {
    return NextResponse.json({
      id: json.data.me.id,
      email: json.data.me.email,
    });
  }

  return NextResponse.json(null, { status: 404 });
}
