import { useState } from 'react';

export const useFetch = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeFetch = async ({ url, method, accessToken, body }: any) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setData(responseData);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return { executeFetch, data, loading, error };
};
