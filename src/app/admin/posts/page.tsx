'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function PostsManagement() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsAPI.getAll();
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Nie udało się załadować postów');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten post?')) return;

    try {
      await postsAPI.delete(id);
      toast.success('Post usunięty');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Nie udało się usunąć posta');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Zarządzanie Postami</h1>
        <button
          onClick={() => router.push('/admin/posts/create')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Dodaj Nowy Post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tytuł
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  Brak postów do wyświetlenia
                </td>
              </tr>
            ) : (
              posts.map((post: any) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('pl-PL')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Opublikowany
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        console.log('Navigating to edit post with ID:', post._id);
                        router.push(`/admin/posts/${post._id}/edit`);
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}