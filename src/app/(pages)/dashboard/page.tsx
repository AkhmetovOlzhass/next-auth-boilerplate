import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth-utils';
import { getServerAccessToken } from '@/lib/get-server-access-token';

export default async function DashboardPage() {
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    redirect('/signin');
  }

  const user = await getCurrentUser(accessToken);

  if (!user) {
    redirect('/signin');
  }

  return (
    <div className='flex min-h-screen flex-col p-4 bg-gray-50'>
      <header className='container mx-auto py-6 flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <form action='/api/auth/logout' method='post'>
          <Button type='submit' variant='outline'>
            Sign Out
          </Button>
        </form>
      </header>

      <main className='container mx-auto flex-1 py-8'>
        <Card>
          <CardHeader>
            <CardTitle>Welcome to your dashboard</CardTitle>
            <CardDescription>You are signed in as {user.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your user ID: {user.id}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
