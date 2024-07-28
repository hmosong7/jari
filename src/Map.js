import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Firebase 초기화 파일을 가져옵니다.
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Map from './Map';

function App() {
  const [locations, setLocations] = useState([]);
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'trashes'));
      const locationsData = querySnapshot.docs.map(doc => doc.data());
      setLocations(locationsData);
    };

    fetchLocations();
  }, []);

  const addLocation = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'trashes'), {
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng)
    });
    setDescription('');
    setLat('');
    setLng('');
    // 데이터를 다시 불러옵니다
    const querySnapshot = await getDocs(collection(db, 'trashes'));
    const locationsData = querySnapshot.docs.map(doc => doc.data());
    setLocations(locationsData);
  };

  return (
    <div>
      <h1>Trash Finder</h1>
      <form onSubmit={addLocation}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          required
        />
        <button type="submit">Add Location</button>
      </form>
      <Map locations={locations} />
      <ul>
        {locations.map((location, index) => (
          <li key={index}>{location.description} - {location.lat}, {location.lng}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
