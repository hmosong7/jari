import React, { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

function App() {
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const handleUpload = async () => {
    if (image) {
      const imageRef = ref(storage, `images/${Date.now()}-${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'trashes'), {
        description,
        rating,
        location,
        imageUrl,
      });

      setDescription('');
      setRating(0);
      setImage(null);
      setLocation({ lat: 0, lng: 0 });
      alert('Upload successful');
    }
  };

  return (
    <div>
      <h1>Trash Finder</h1>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Rating"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <input
        type="text"
        placeholder="Latitude"
        value={location.lat}
        onChange={(e) => setLocation({ ...location, lat: Number(e.target.value) })}
      />
      <input
        type="text"
        placeholder="Longitude"
        value={location.lng}
        onChange={(e) => setLocation({ ...location, lng: Number(e.target.value) })}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default App;
