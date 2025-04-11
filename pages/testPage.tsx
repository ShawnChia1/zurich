import { useState, useEffect } from 'react';
import { Row } from '@/lib/db';

export default function UserList() {
  const [users, setUsers] = useState<Row[]>([]); // Added type to users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function fetchUsers() { // IIFE
      try {
        const response = await fetch('/api/users');
        console.log('Raw Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed JSON Data:', data);
        setUsers(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
          setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      Hello <br />
      {users.map((user: Row, index) => (
        <div key={index}> {/* use user.id as key */}
          Task Name: {user.taskName} <br />
          Start Date: {user.startDate ? user.startDate.toLocaleDateString() : 'N/A'} <br />
          Start Time: {user.startTime} <br />
          End Time: {user.endTime} <br />
          Indicator: {user.indicator} <br />
          Row Count Updated: {user.rowCountUpdated} <br />
          Row Count Inserted: {user.rowCountInserted} <br />
          ID: {user.id} <br />
          <br />
        </div>
      ))}
    </div>
  );
}