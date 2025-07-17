import { useEffect, useState } from 'react';

export default function Protected() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchProtected = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/protected', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await res.json();
      setData(result);
    };

    fetchProtected();
  }, []);

  return (
    <div>
      <h2>Protected Page</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading protected data...</p>
      )}
    </div>
  );
}
