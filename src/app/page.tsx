import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('accessToken')?.value;

  if (accessToken) {
    redirect('/dashboard');
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold tracking-tight'>Welcome</h1>
          <p className='mt-3 text-gray-600'>Sign in to your account or create a new one</p>
        </div>
        <div className='flex flex-col space-y-4'>
          <Button asChild className='w-full'>
            <Link href='/signin'>Sign In</Link>
          </Button>
          <Button asChild variant='outline' className='w-full'>
            <Link href='/signup'>Create Account</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
