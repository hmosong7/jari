import React, { useState, useEffect } from 'react';
import { db, storage, auth } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Map from './Map';

function App() {
  const [locations, setLocations] = useState([]);
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      const querySnapshot = await getDocs(collection(db, 'trashes'));
      const locationsData = querySnapshot.docs.map(doc => doc.data());
      setLocations(locationsData);
    };

    fetchLocations();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const addLocation = async (e) => {
    e.preventDefault();
    let imageUrl = '';

    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, 'trashes'), {
      description,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      imageUrl
    });

    setDescription('');
    setLat('');
    setLng('');
    setImage(null);
    const querySnapshot = await getDocs(collection(db, 'trashes'));
    const locationsData = querySnapshot.docs.map(doc => doc.data());
    setLocations(locationsData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div>
      <h1>Trash Finder</h1>
      {user ? (
        <div>
          <button onClick={handleLogout}>Logout</button>
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
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button type="submit">Add Location</button>
          </form>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      )}
      <Map locations={locations} />
      <ul>
        {locations.map((location, index) => (
          <li key={index}>
            {location.description} - {location.lat}, {location.lng}
            {location.imageUrl && <img src={location.imageUrl} alt={location.description} width="100" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
