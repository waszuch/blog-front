'use client';

import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import { FileText, PlusCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  const adminActions = [
    {
      title: 'View All Posts',
      description: 'Manage and view all blog posts',
      icon: FileText,
      href: '/admin/posts',
      color: 'bg-blue-500',
    },
    {
      title: 'Create New Post',
      description: 'Write a new blog post',
      icon: PlusCircle,
      href: '/admin/posts/create',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username || 'Admin'}!
          </h1>
          <p className="mt-2 text-gray-600">
            What would you like to do today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className={`${action.color} p-4 flex items-center justify-center`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Tips
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Create a new post by clicking the "Create New Post" card above</li>
            <li>• View and manage all posts in the "View All Posts" section</li>
            <li>• Use the navigation bar at the top to quickly move between sections</li>
          </ul>
        </div>
      </div>
    </div>
  );
}