'use client';

import { useEffect, useState } from 'react';
import { getHome } from '@/lib/api';

export default function DebugPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHome()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className=" max-w-5xl mx-auto p-6 text-white\>
 <h1 className=\text-2xl font-bold mb-4\>API Debug Viewer</h1>
 {error && <p className=\text-red-400 mb-4\>Error: {error}</p>}
 <div className=\bg-gray-900 p-4 rounded-lg overflow-auto max-h-[80vh]\>
 <pre className=\text-xs text-green-400 font-mono\>
 {data ? JSON.stringify(data, null, 2) : 'Loading data...'}
 </pre>
 </div>
 </div>
 );
}
