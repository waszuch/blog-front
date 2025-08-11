'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', current: pathname === '/admin' },
    { name: 'Posts', href: '/admin/posts', current: pathname.startsWith('/admin/posts') },
    { name: 'New Post', href: '/admin/posts/create', current: pathname === '/admin/posts/create' },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/admin" className="text-xl font-bold text-gray-900">
                    Admin Panel
                  </Link>
                </div>
                <div className="ml-6 flex space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        item.current
                          ? 'border-blue-500 text-gray-900'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.username}!
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
        {/* Main content */}
        <main className="max-w-7xl mx-auto py-6 px-4">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}

