import { useState, useEffect } from 'react';
import { Extension } from '@/lib/db';

export default function extensionList() {
  const [extension, setextension] = useState<Extension[]>([]); // Added type to extension state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function fetchextension() {
      try {
        const response = await fetch('/api/extensions');
        console.log('Raw Response:', response);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed JSON Data:', data);
        setextension(data);
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
      {extension.map((extension: Extension, index) => (
        <div key={index}> {/* use extension.id as key */}
          item: {extension.item} <br />
          eventName: {extension.eventName} <br />
          venue: {extension.venue} <br />
          eventDate: {extension.eventDate ? extension.eventDate.toLocaleDateString() : 'N/A'} <br />
          sumInsuredPerPerson: {extension.sumInsuredPerPerson} <br />
          <br />
        </div>
      ))}
    </div>
  );
}