'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export default function TestPage() {
  const [status, setStatus] = useState<string>('Checking connection...');
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  useEffect(() => {
    // Pokazujemy skonfigurowany URL API
    setApiUrl(process.env.NEXT_PUBLIC_API_URL || 'Not configured');

    // Test połączenia
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test endpointu health check lub podobnego
      const response = await api.get('/');
      setStatus('Connection successful!');
      console.log('API Response:', response.data);
    } catch (err: any) {
      setError(err.message);
      setStatus('Connection failed');
      console.error('API Error:', err);
    }
  };

  const testAuth = async () => {
    try {
      setStatus('Testing authentication...');
      const response = await api.post('/auth/login', {
        email: 'test@example.com',
        password: 'test123'
      });
      console.log('Auth Response:', response.data);
      setStatus('Authentication test completed');
    } catch (err: any) {
      setError(err.message);
      setStatus('Authentication test failed');
      console.error('Auth Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">API URL Configuration:</h2>
              <p className="text-gray-600">{apiUrl}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Connection Status:</h2>
              <p className={error ? 'text-red-600' : 'text-green-600'}>{status}</p>
              {error && (
                <p className="text-red-600 text-sm mt-1">Error: {error}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={testConnection}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Test Connection
              </button>
              
              <button
                onClick={testAuth}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Test Authentication
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Debugging Tips:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Make sure your backend server is running on port 5000</li>
            <li>Check if CORS is properly configured on the backend</li>
            <li>Verify that the API endpoints match your backend routes</li>
            <li>Check the browser console for detailed error messages</li>
            <li>Verify that your .env.local file is properly configured</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

