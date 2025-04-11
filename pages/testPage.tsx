import { useState, useEffect } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        console.log('Raw Response:', response); // Log the entire Response object

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed JSON Data:', data); // Log the parsed JSON data
        setUsers(data);

      } catch (err) {
        console.error('Error:', err);
      }
    }

    fetchUsers();
  }, []);

  return (
    <div>
        Hello
    </div>
  );
}