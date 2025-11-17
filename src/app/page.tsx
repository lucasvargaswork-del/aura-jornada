'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredData } from '@/lib/storage';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const userData = getStoredData();
    
    if (!userData || !userData.onboardingCompleted) {
      router.push('/onboarding/welcome');
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#0E1117]">
      <div className="w-12 h-12 border-4 border-[#4AFF8B] border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400">Carregando...</p>
    </div>
  );
}
