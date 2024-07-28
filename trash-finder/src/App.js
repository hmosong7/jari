import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firebase 초기화 파일을 가져옵니다.
import { collection, getDocs } from 'firebase/firestore';

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'trashes'));
      const locationsData = querySnapshot.docs.map(doc => doc.data());
      setLocations(locationsData);
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <h1>Trash Finder</h1>
      <ul>
        {locations.map((location, index) => (
          <li key={index}>{location.description} - {location.lat}, {location.lng}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
