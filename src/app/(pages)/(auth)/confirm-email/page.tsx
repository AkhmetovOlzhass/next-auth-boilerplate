'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setError('No confirmation token found');
        return;
      }

      try {
        const response = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to confirm email');
        }

        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(
          err instanceof Error ? err.message : 'An error occurred during email confirmation',
        );
      }
    };

    confirmEmail();
  }, [searchParams]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Email Confirmation</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Verifying your email address...'}
            {status === 'success' && 'Your email has been confirmed successfully!'}
            {status === 'error' && 'There was a problem confirming your email.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'loading' && (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-12 w-12 animate-spin text-primary' />
            </div>
          )}

          {status === 'success' && (
            <div className='flex flex-col items-center py-8 space-y-4'>
              <CheckCircle2 className='h-16 w-16 text-green-500' />
              <p className='text-center text-gray-600'>
                Your account is now active. You can now sign in with your credentials.
              </p>
            </div>
          )}

          {status === 'error' && (
            <Alert variant='destructive' className='my-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                {error || 'The confirmation link is invalid or has expired.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button asChild className='w-full'>
            <Link href='/signin'>{status === 'success' ? 'Go to Sign In' : 'Try Signing In'}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
