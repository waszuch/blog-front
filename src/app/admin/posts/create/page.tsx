'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { postsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface PostForm {
  title: string;
  content: string;
  excerpt: string;
  tags: string;
  category: string;
  status: 'draft' | 'published';
  author: string;
}

const CATEGORIES = [
  'Dyrektywa NIS2',
  'Cyberbezpieczeństwo',
  'Implementacja'
];

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<PostForm>();

  const onSubmit = async (data: PostForm) => {
    setLoading(true);
    try {
      // Przekształć string tagów na tablicę
      const tags = data.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const postData = {
        ...data,
        tags,
        readTime: Math.ceil(data.content.split(' ').length / 200) // ~200 słów/min
      };

      console.log('Sending post data:', postData);
      await postsAPI.create(postData);
      
      toast.success('Post utworzony pomyślnie!');
      router.push('/admin/posts');
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.response?.data?.error || 'Błąd podczas tworzenia posta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Utwórz nowy post</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        {/* Tytuł */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tytuł</label>
          <input
            {...register('title', { required: 'Tytuł jest wymagany' })}
            type="text"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Skrót */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skrót (excerpt)
          </label>
          <textarea
            {...register('excerpt', { required: 'Skrót jest wymagany' })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.excerpt && (
            <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
          )}
        </div>

        {/* Kategoria */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategoria</label>
          <select
            {...register('category', { required: 'Kategoria jest wymagana' })}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Wybierz kategorię</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Tagi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tagi (oddzielone przecinkami)
          </label>
          <input
            {...register('tags')}
            type="text"
            placeholder="np. NIS2, cyberbezpieczeństwo, implementacja"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('status')}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="draft">Szkic</option>
            <option value="published">Opublikowany</option>
          </select>
        </div>

        {/* Autor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Autor</label>
          <input
            {...register('author')}
            type="text"
            defaultValue="NIS2 Team"
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Treść */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Treść (HTML)
          </label>
          <textarea
            {...register('content', { required: 'Treść jest wymagana' })}
            rows={15}
            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm"
            placeholder="<h2>Tytuł sekcji</h2>
<p>Treść paragrafu...</p>"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Przyciski */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Anuluj
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Tworzenie...' : 'Utwórz post'}
          </button>
        </div>
      </form>
    </div>
  );
}

