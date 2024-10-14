import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome to Family Finance Tracker</h1>
      <div className="space-y-4">
        <Button asChild className="w-full">
          <Link href="/login">Login</Link>
        </Button>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Track and manage your family finances with ease.
        </p>
      </div>
    </div>
  );
}