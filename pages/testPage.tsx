import { useState, useEffect } from 'react';
import { Extension } from '@/lib/db';

export default function ExtensionList() {
  const [extension, setextension] = useState<Extension[]>([]); // Added type to extension state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async function fetchextension() {
      try {
        const response = await fetch('/api/extensions');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Parsed JSON Data:', data);
        setextension(data);
        console.log("Extension: " + extension);
      } catch (err) {
        console.error('Error:', err);
      } finally {
          setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    console.log("Extension: ", extension);
  }, [extension]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <b>Data below:</b>
      <br /> <br />
      {extension.map((extension: Extension, index) => (
        <div key={index}> {/* use extension.id as key */}
          item: {extension.Item} <br />
          eventName: {extension.EventName} <br />
          venue: {extension.Venue} <br />
          eventDate: {extension.EventDate ? new Date (extension.EventDate).toLocaleDateString() : 'N/A'} <br />
          sumInsuredPerPerson: {extension.SumInsuredPerPerson} <br />
          <br />
        </div>
      ))}
    </div>
  );
}