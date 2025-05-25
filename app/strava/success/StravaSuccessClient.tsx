'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function StravaSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const access_token = searchParams.get('access_token');

  useEffect(() => {
    if (access_token) {
      localStorage.setItem('strava_access_token', access_token);
      console.log('Access token saved to localStorage!');
      router.push('/dashboard');
    
    }
  }, [access_token]);

  return <p>Connected to Strava! You can now fetch activities.</p>;
}
