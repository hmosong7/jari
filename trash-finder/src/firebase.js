import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

  const firebaseConfig = {
    apiKey: "AIzaSyB9mrPlxe-zX05lXF8f5pU9u6TIguZ63aE",
    authDomain: "jari-4e560.firebaseapp.com",
    projectId: "jari-4e560",
    storageBucket: "jari-4e560.appspot.com",
    messagingSenderId: "348214782099",
    appId: "1:348214782099:web:034c71936416822f14c566",
    measurementId: "G-WQQTL2Y87L"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
