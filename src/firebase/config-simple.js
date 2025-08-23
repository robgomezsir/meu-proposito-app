// Configuração simples do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDUE5y8eoVg0bC0EZ6ELK-MLsb5cWQ9UWg",
  authDomain: "sistema-proposito.firebaseapp.com",
  projectId: "sistema-proposito",
  storageBucket: "sistema-proposito.firebasestorage.app",
  messagingSenderId: "1013356002672",
  appId: "1:1013356002672:web:d70332b444a33ae0c7a3b5",
  measurementId: "G-5ZDC0QFEZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
export default app;
