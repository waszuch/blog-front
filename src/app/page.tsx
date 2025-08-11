'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Blog System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Welcome to the blog management system
          </p>

          <div className="mt-10 space-y-4">
            {!user ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-600">Please log in to continue</p>
                <Link
                  href="/login"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-lg text-gray-600">
                  Logged in as: <span className="font-semibold">{user.email}</span>
                </div>
                
                <div className="space-y-4">
                  <Link
                    href="/admin"
                    className="block w-full sm:w-auto sm:inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Go to Admin Panel
                  </Link>
                  
                  <Link
                    href="/admin/posts/create"
                    className="block w-full sm:w-auto sm:inline-block ml-0 sm:ml-4 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create New Post
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}